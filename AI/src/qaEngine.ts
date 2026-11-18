import { RelationshipGraphEngine } from './relationshipGraph.js';
import { KnowledgeRetrievalEngine } from './knowledgeRetrieval.js';
import { FamilyDataConnector } from './dataConnector.js';
import type {
  QARequest,
  QAResponse,
  QAIntent,
  QASource,
  FamilyMemberNode,
} from './types/index.js';

export class FamilyQAEngine {
  private connector: FamilyDataConnector;
  private retrieval: KnowledgeRetrievalEngine;
  private graphEngine: RelationshipGraphEngine | null = null;
  private chatHistory: Map<string, Array<{ role: 'user' | 'assistant'; content: string }>> = new Map();

  constructor(connector: FamilyDataConnector, retrieval: KnowledgeRetrievalEngine) {
    this.connector = connector;
    this.retrieval = retrieval;
  }

  /** Lấy hoặc khởi tạo RelationshipGraphEngine cho một gia tộc */
  private async getGraph(familyId: string): Promise<RelationshipGraphEngine> {
    const tree = await this.connector.getGenealogyTree(familyId);
    if (!this.graphEngine) {
      this.graphEngine = new RelationshipGraphEngine(
        tree.nodes,
        tree.parentChildEdges,
        tree.marriageEdges
      );
    } else {
      this.graphEngine.initGraph(tree.nodes, tree.parentChildEdges, tree.marriageEdges);
    }
    return this.graphEngine;
  }

  /** Phân loại ý định của người dùng (Intent Classification) */
  public classifyIntent(prompt: string): QAIntent {
    const p = prompt.toLowerCase();

    // 1. Ý định hỏi về xưng hô, quan hệ
    if (
      p.includes('quan hệ') ||
      p.includes('xưng hô') ||
      p.includes('gọi là gì') ||
      p.includes('xưng là gì') ||
      p.includes('bà con thế nào') ||
      p.includes('có họ hàng') ||
      p.includes('là gì của') ||
      p.includes('vai vế')
    ) {
      return 'RELATIONSHIP_QUERY';
    }

    // 2. Ý định hỏi về gia quy, di sản, truyền thống
    if (
      p.includes('gia quy') ||
      p.includes('di sản') ||
      p.includes('điều răn') ||
      p.includes('truyền thống') ||
      p.includes('quy định') ||
      p.includes('văn bia') ||
      p.includes('phả ký') ||
      p.includes('khuyến học')
    ) {
      return 'HERITAGE_RULES';
    }

    // 3. Ý định hỏi về sự kiện, giỗ chạp, ngày hội
    if (
      p.includes('sự kiện') ||
      p.includes('giỗ') ||
      p.includes('ngày hội') ||
      p.includes('lễ') ||
      p.includes('khi nào diễn ra') ||
      p.includes('tổ chức ở đâu') ||
      p.includes('rsvp') ||
      p.includes('người tham gia')
    ) {
      return 'EVENT_INFO';
    }

    // 4. Ý định hỏi về thống kê, tổng quan
    if (
      p.includes('bao nhiêu thành viên') ||
      p.includes('mấy thế hệ') ||
      p.includes('bao nhiêu thế hệ') ||
      p.includes('thống kê') ||
      p.includes('tổng số người')
    ) {
      return 'STATISTICS_SUMMARY';
    }

    // 5. Ý định tra cứu thông tin thành viên cụ thể
    if (
      p.includes('làm nghề gì') ||
      p.includes('sinh năm') ||
      p.includes('bao nhiêu tuổi') ||
      p.includes('tiểu sử') ||
      p.includes('học ở đâu') ||
      p.includes('ai là') ||
      p.includes('thành viên') ||
      p.includes('đời thứ')
    ) {
      return 'MEMBER_LOOKUP';
    }

    return 'GENERAL_FAMILY_CHAT';
  }

  /** Trích xuất tên thành viên xuất hiện trong câu hỏi */
  private extractMemberNames(prompt: string, members: FamilyMemberNode[]): FamilyMemberNode[] {
    const matched: FamilyMemberNode[] = [];
    const lower = prompt.toLowerCase();

    for (const m of members) {
      const nameLower = m.fullName.toLowerCase();
      // So khớp tên đầy đủ hoặc tên gọi (ví dụ: "Bình", "Cụ", "An", "Linh")
      if (lower.includes(nameLower)) {
        matched.push(m);
        continue;
      }
      const words = nameLower.split(/\s+/);
      const lastName = words[words.length - 1]; // Tên chính
      if (lastName && lastName.length > 1 && new RegExp(`\\b${lastName}\\b`, 'i').test(prompt)) {
        if (!matched.some((item) => item.memberId === m.memberId)) {
          matched.push(m);
        }
      }
    }
    return matched;
  }

  /** Xử lý trả lời Q&A nguyên mẫu dựa trên dữ liệu gia đình */
  public async answerQuestion(request: QARequest): Promise<QAResponse> {
    const { familyId, prompt } = request;
    const conversationId = request.conversationId || `conv_${Date.now()}`;
    const intent = this.classifyIntent(prompt);

    const graph = await this.getGraph(familyId);
    const allMembers = graph.getAllMembers();
    const tree = await this.connector.getGenealogyTree(familyId);

    let answer = '';
    let confidence = 0.9;
    const sources: QASource[] = [];
    const suggestedFollowUps: string[] = [];

    // ==================== TRƯỜNG HỢP 1: HỎI VỀ MỐI QUAN HỆ & XƯNG HÔ ====================
    if (intent === 'RELATIONSHIP_QUERY') {
      const mentioned = this.extractMemberNames(prompt, allMembers);
      let memA: FamilyMemberNode | undefined;
      let memB: FamilyMemberNode | undefined;

      if (mentioned.length >= 2) {
        memA = mentioned[0];
        memB = mentioned[1];
      } else if (mentioned.length === 1 && request.currentMemberId) {
        memA = graph.getMember(request.currentMemberId);
        memB = mentioned[0];
      } else if (mentioned.length === 1) {
        // Mặc định đối sánh với Cụ tổ hoặc người đứng đầu chi
        memA = allMembers[0];
        memB = mentioned[0];
      }

      if (memA && memB) {
        const analysis = graph.analyzeRelationship(memA.memberId, memB.memberId);
        if (analysis) {
          answer = `Theo cây gia phả ${tree.familyName}:\n`;
          answer += `• Danh xưng chuẩn mực: **${memA.fullName}** gọi **${memB.fullName}** là **${analysis.relationTitle}**.\n`;
          answer += `• Giải thích chi tiết: ${analysis.detailedExplanation}\n`;
          if (analysis.pathDescription.length > 2) {
            answer += `• Mạch liên kết phả hệ: ${analysis.pathDescription.join(' ➔ ')}`;
          }

          sources.push({
            type: 'RELATIONSHIP',
            id: `${memA.memberId}_${memB.memberId}`,
            title: `Phân tích phả hệ: ${memA.fullName} & ${memB.fullName}`,
            snippet: analysis.detailedExplanation,
          });
          suggestedFollowUps.push(
            `Xem thêm tiểu sử của ${memB.fullName}`,
            `Những sự kiện ${memA.fullName} và ${memB.fullName} cùng tham gia`
          );
        }
      } else {
        answer = `Để xác định cách xưng hô chính xác, bạn vui lòng nêu rõ tên 2 thành viên cần tra cứu trong gia phả (ví dụ: "Nguyễn Văn An và Nguyễn Văn Bình xưng hô thế nào?").`;
        confidence = 0.6;
      }
    }

    // ==================== TRƯỜNG HỢP 2: HỎI VỀ GIA QUY & TÀI LIỆU DI SẢN ====================
    else if (intent === 'HERITAGE_RULES') {
      const heritageDocs = await this.connector.getFamilyHeritage(familyId);
      const relevantChunks = await this.retrieval.searchKnowledge(familyId, prompt, 3);

      if (heritageDocs.length > 0) {
        const primaryDoc = heritageDocs[0];
        answer = `Dựa trên tài liệu di sản **${primaryDoc?.title}** của ${tree.familyName}:\n`;
        answer += `${primaryDoc?.description}\n\n`;
        answer += `Các điều răn dạy luôn nhấn mạnh lòng hiếu thảo, tinh thần tương thân tương ái giữa các thành viên và rèn luyện đạo đức, tri thức để làm rạng danh dòng tộc.`;

        for (const doc of heritageDocs) {
          sources.push({
            type: 'DOCUMENT',
            id: doc.documentId,
            title: doc.title,
            snippet: doc.description || undefined,
          });
        }
        suggestedFollowUps.push('Xem toàn văn Gia quy năm 1998', 'Quy chế Quỹ khuyến học dòng họ');
      } else {
        answer = `Hiện tại hệ thống chưa lưu trữ bản ghi tài liệu di sản riêng của gia tộc này. Quản trị viên có thể tải lên các văn bản di sản để AI hỗ trợ tra cứu chi tiết.`;
        confidence = 0.5;
      }
    }

    // ==================== TRƯỜNG HỢP 3: HỎI VỀ SỰ KIỆN GIA TỘC ====================
    else if (intent === 'EVENT_INFO') {
      const events = await this.connector.getFamilyEvents(familyId);
      if (events.length > 0) {
        answer = `Thông tin các sự kiện quan trọng của ${tree.familyName}:\n`;
        for (const ev of events) {
          const goingCount = ev.attendees?.filter((a) => a.status === 'GOING').length || 0;
          answer += `• **${ev.title}**\n`;
          answer += `  - Thời gian: ${new Date(ev.eventDate).toLocaleString('vi-VN')}\n`;
          answer += `  - Địa điểm: ${ev.location || 'Tại nhà thờ từ đường họ'}\n`;
          answer += `  - Mô tả: ${ev.description || ''}\n`;
          answer += `  - Người tham gia: Đã có ${goingCount} thành viên xác nhận tham dự (RSVP GOING).\n\n`;

          sources.push({
            type: 'EVENT',
            id: ev.eventId,
            title: ev.title,
            snippet: `${ev.location} - ${ev.eventDate}`,
          });
        }
        suggestedFollowUps.push('Xác nhận tham gia sự kiện (RSVP)', 'Xem danh sách người tham gia');
      } else {
        answer = `Gia tộc hiện chưa có sự kiện nào sắp tới trong lịch hoạt động.`;
        confidence = 0.7;
      }
    }

    // ==================== TRƯỜNG HỢP 4: THỐNG KÊ GIA ĐÌNH ====================
    else if (intent === 'STATISTICS_SUMMARY') {
      const total = allMembers.length;
      const living = allMembers.filter((m) => !m.deathDate).length;
      const deceased = total - living;
      const gens = Array.from(new Set(allMembers.map((m) => m.generation))).sort();
      const males = allMembers.filter((m) => m.gender === 'male').length;
      const females = allMembers.filter((m) => m.gender === 'female').length;

      answer = `Thống kê tổng quan gia phả **${tree.familyName}**:\n`;
      answer += `• Tổng số thành viên ghi nhận: **${total}** người (Nam: ${males}, Nữ: ${females}).\n`;
      answer += `• Trạng thái: **${living}** thành viên còn sống, **${deceased}** tiền nhân đã quy tiên.\n`;
      answer += `• Quy mô thế hệ: Trải dài qua **${gens.length} thế hệ** (từ Đời thứ 1 đến Đời thứ ${Math.max(...gens)}).\n`;
      answer += `• Các ngành nghề tiêu biểu: Công nghệ thông tin, Y dược, Sư phạm, Luật pháp và Doanh nhân.`;

      sources.push({
        type: 'MEMBER',
        id: 'genealogy_stats',
        title: `Thống kê số liệu ${tree.familyName}`,
        snippet: `Tổng: ${total} người, ${gens.length} thế hệ.`,
      });
      suggestedFollowUps.push('Xem danh sách thành viên thế hệ thứ 2', 'Xem danh sách người làm ngành công nghệ');
    }

    // ==================== TRƯỜNG HỢP 5: TRA CỨU THÀNH VIÊN HOẶC CHUNG ====================
    else {
      const searchResults = await this.retrieval.searchKnowledge(familyId, prompt, 3);
      if (searchResults.length > 0) {
        answer = `Dựa trên dữ liệu gia phả ${tree.familyName}, hệ thống tìm thấy các thông tin liên quan:\n\n`;
        for (const res of searchResults) {
          answer += `• **${res.title}**\n  ${res.content}\n\n`;
          sources.push({
            type: res.type,
            id: res.id,
            title: res.title,
            snippet: res.content.slice(0, 150),
          });
        }
      } else {
        answer = `Trợ lý AI FamilyConnect đã tra cứu toàn bộ hồ sơ gia phả nhưng chưa tìm thấy dữ liệu khớp với câu hỏi "${prompt}". Bạn có thể hỏi về các thành viên, quan hệ xưng hô, gia quy hoặc sự kiện dòng họ!`;
        confidence = 0.5;
      }
    }

    // Lưu vào lịch sử hội thoại
    if (!this.chatHistory.has(conversationId)) {
      this.chatHistory.set(conversationId, []);
    }
    const history = this.chatHistory.get(conversationId)!;
    history.push({ role: 'user', content: prompt });
    history.push({ role: 'assistant', content: answer });

    return {
      conversationId,
      prompt,
      answer,
      intent,
      confidence,
      sources,
      suggestedFollowUps,
      generatedAt: new Date().toISOString(),
    };
  }

  /** Lấy lịch sử hội thoại */
  public getConversation(conversationId: string): Array<{ role: 'user' | 'assistant'; content: string }> {
    return this.chatHistory.get(conversationId) || [];
  }
}
