import { FamilyDataConnector } from './dataConnector.js';
import type {
  FamilyMemberNode,
  FamilyHeritageDoc,
  FamilyEventData,
  FamilyPostData,
  QASource,
} from './types/index.js';

export interface KnowledgeChunk {
  id: string;
  type: 'MEMBER' | 'DOCUMENT' | 'EVENT' | 'POST';
  title: string;
  content: string;
  metadata: Record<string, any>;
  score?: number;
}

export class KnowledgeRetrievalEngine {
  private connector: FamilyDataConnector;

  constructor(connector: FamilyDataConnector) {
    this.connector = connector;
  }

  /** Chuẩn hóa xâu ký tự để so khớp linh hoạt */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .trim();
  }

  /** Xây dựng kho tri thức Knowledge Chunks từ dữ liệu gia tộc */
  public async buildKnowledgeChunks(familyId: string): Promise<KnowledgeChunk[]> {
    const chunks: KnowledgeChunk[] = [];

    // 1. Chunks từ thành viên gia phả
    const treeData = await this.connector.getGenealogyTree(familyId);
    for (const m of treeData.nodes) {
      const parts = [
        `Họ và tên: ${m.fullName}`,
        `Giới tính: ${m.gender === 'male' ? 'Nam' : m.gender === 'female' ? 'Nữ' : 'Khác'}`,
        `Thế hệ (đời) thứ: ${m.generation}`,
        m.birthDate ? `Ngày sinh: ${m.birthDate}` : '',
        m.deathDate ? `Ngày mất: ${m.deathDate}` : 'Còn sống',
        m.occupation ? `Nghề nghiệp: ${m.occupation}` : '',
        m.education ? `Học vấn / Bằng cấp: ${m.education}` : '',
        m.biography ? `Tiểu sử: ${m.biography}` : '',
        m.branchName ? `Thuộc chi nhánh: ${m.branchName}` : '',
      ].filter(Boolean);

      chunks.push({
        id: m.memberId,
        type: 'MEMBER',
        title: `Thành viên: ${m.fullName} (Đời thứ ${m.generation})`,
        content: parts.join(' | '),
        metadata: {
          generation: m.generation,
          occupation: m.occupation,
          gender: m.gender,
          fullName: m.fullName,
        },
      });
    }

    // 2. Chunks từ tài liệu di sản & gia quy
    const heritageDocs = await this.connector.getFamilyHeritage(familyId);
    for (const doc of heritageDocs) {
      chunks.push({
        id: doc.documentId,
        type: 'DOCUMENT',
        title: `Tài liệu di sản: ${doc.title}`,
        content: `${doc.title}. Loại tài liệu: ${doc.documentType}. Nội dung: ${doc.description || 'Không có mô tả chi tiết'}`,
        metadata: {
          documentType: doc.documentType,
          title: doc.title,
        },
      });
    }

    // 3. Chunks từ sự kiện gia tộc
    const events = await this.connector.getFamilyEvents(familyId);
    for (const ev of events) {
      const attendeesCount = ev.attendees?.filter((a) => a.status === 'GOING').length || 0;
      chunks.push({
        id: ev.eventId,
        type: 'EVENT',
        title: `Sự kiện: ${ev.title}`,
        content: `${ev.title}. Ngày diễn ra: ${ev.eventDate}. Địa điểm: ${ev.location || 'Chưa cập nhật'}. Mô tả: ${ev.description || ''}. Số người tham gia: ${attendeesCount}`,
        metadata: {
          eventDate: ev.eventDate,
          location: ev.location,
        },
      });
    }

    // 4. Chunks từ bài viết cộng đồng
    const posts = await this.connector.getFamilyPosts(familyId);
    for (const p of posts) {
      chunks.push({
        id: p.postId,
        type: 'POST',
        title: `Bài viết: ${p.authorName ? p.authorName + ': ' : ''}${p.content.slice(0, 40)}...`,
        content: p.content,
        metadata: {
          isAnnouncement: p.isAnnouncement,
          authorName: p.authorName,
        },
      });
    }

    return chunks;
  }

  /** Cơ chế truy xuất dữ liệu & Tìm kiếm ngữ nghĩa thử nghiệm (Semantic & Token-based) */
  public async searchKnowledge(
    familyId: string,
    query: string,
    topK: number = 5
  ): Promise<KnowledgeChunk[]> {
    const chunks = await this.buildKnowledgeChunks(familyId);
    if (!query || !query.trim()) return chunks.slice(0, topK);

    const normQuery = this.normalize(query);
    const rawQuery = query.toLowerCase();
    const queryTokens = normQuery.split(/\s+/).filter((t) => t.length > 1);

    const scored = chunks.map((chunk) => {
      let score = 0;
      const normContent = this.normalize(chunk.content);
      const rawContent = chunk.content.toLowerCase();
      const normTitle = this.normalize(chunk.title);

      // 1. Exact phrase match
      if (rawContent.includes(rawQuery) || rawContent.includes(normQuery)) {
        score += 8.0;
      }
      if (normTitle.includes(normQuery)) {
        score += 6.0;
      }

      // 2. Token overlap match
      for (const token of queryTokens) {
        if (normTitle.includes(token)) score += 3.0;
        if (normContent.includes(token)) score += 1.5;
      }

      // 3. Entity boosting (nếu truy vấn hỏi về nghề nghiệp, đời, gia quy)
      if (chunk.type === 'MEMBER') {
        const genMatch = query.match(/(?:thế hệ|đời)\s*(?:thứ\s*)?(\d+)/i);
        if (genMatch && genMatch[1] && chunk.metadata.generation === parseInt(genMatch[1])) {
          score += 5.0;
        }
      }
      if (chunk.type === 'DOCUMENT' && (rawQuery.includes('gia quy') || rawQuery.includes('di sản') || rawQuery.includes('quy tắc') || rawQuery.includes('điều răn'))) {
        score += 4.0;
      }
      if (chunk.type === 'EVENT' && (rawQuery.includes('sự kiện') || rawQuery.includes('ngày') || rawQuery.includes('giỗ') || rawQuery.includes('tổ chức'))) {
        score += 4.0;
      }

      return { ...chunk, score };
    });

    return scored
      .filter((c) => (c.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  }

  /** Lọc thành viên theo đa tiêu chí (Nghề nghiệp, thế hệ, địa phương) */
  public async findMembersByCriteria(
    familyId: string,
    criteria: {
      occupation?: string;
      generation?: number;
      gender?: string;
      keyword?: string;
    }
  ): Promise<FamilyMemberNode[]> {
    const tree = await this.connector.getGenealogyTree(familyId);
    return tree.nodes.filter((m) => {
      if (criteria.generation && m.generation !== criteria.generation) return false;
      if (criteria.gender && m.gender.toLowerCase() !== criteria.gender.toLowerCase()) return false;
      if (criteria.occupation && (!m.occupation || !this.normalize(m.occupation).includes(this.normalize(criteria.occupation)))) {
        return false;
      }
      if (criteria.keyword) {
        const fullSearch = `${m.fullName} ${m.occupation || ''} ${m.education || ''} ${m.biography || ''}`;
        if (!this.normalize(fullSearch).includes(this.normalize(criteria.keyword))) return false;
      }
      return true;
    });
  }

  /** Chuyển đổi chunks sang danh sách Sources cho Q&A */
  public chunksToSources(chunks: KnowledgeChunk[]): QASource[] {
    return chunks.map((c) => ({
      type: c.type,
      id: c.id,
      title: c.title,
      snippet: c.content.slice(0, 160) + (c.content.length > 160 ? '...' : ''),
    }));
  }
}
