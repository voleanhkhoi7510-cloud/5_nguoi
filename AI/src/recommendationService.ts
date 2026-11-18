import { FamilyDataConnector } from './dataConnector.js';
import type { RecommendationResult, FamilyMemberNode } from './types/index.js';

export class RecommendationService {
  private connector: FamilyDataConnector;

  constructor(connector: FamilyDataConnector) {
    this.connector = connector;
  }

  /** Gợi ý kết nối thành viên và tài nguyên gia tộc */
  public async getRecommendations(
    familyId: string,
    currentMemberId?: string | undefined
  ): Promise<RecommendationResult> {
    const tree = await this.connector.getGenealogyTree(familyId);
    const events = await this.connector.getFamilyEvents(familyId);
    const docs = await this.connector.getFamilyHeritage(familyId);

    const members = tree.nodes;
    let currentMember: FamilyMemberNode | undefined;

    if (currentMemberId) {
      currentMember = members.find(
        (m) => m.memberId === currentMemberId || m.memberId === `mem_${currentMemberId}`
      );
    }

    // 1. Gợi ý thành viên (cùng ngành nghề, cùng thế hệ)
    const otherMembers = currentMember
      ? members.filter((m) => m.memberId !== currentMember?.memberId)
      : members;

    const scoredMembers = otherMembers.map((m) => {
      let score = 0.5;
      let reason = 'Thành viên cùng cội nguồn dòng họ';

      if (currentMember) {
        if (m.generation === currentMember.generation) {
          score += 0.3;
          reason = `Cùng thế hệ thứ ${m.generation} với bạn - Dễ dàng kết nối, chia sẻ cuộc sống`;
        }
        if (
          m.occupation &&
          currentMember.occupation &&
          (m.occupation.toLowerCase().includes(currentMember.occupation.toLowerCase()) ||
            currentMember.occupation.toLowerCase().includes(m.occupation.toLowerCase()))
        ) {
          score += 0.4;
          reason = `Cùng làm việc trong lĩnh vực ${m.occupation} - Cơ hội giao lưu chuyên môn`;
        }
      } else {
        if (m.occupation?.toLowerCase().includes('kỹ sư') || m.occupation?.toLowerCase().includes('công nghệ')) {
          reason = `Thành viên tiêu biểu trong ngành công nghệ (${m.occupation})`;
          score += 0.2;
        }
      }

      return {
        memberId: m.memberId,
        fullName: m.fullName,
        generation: m.generation,
        occupation: m.occupation,
        reason,
        matchScore: Math.min(1.0, Math.round(score * 100) / 100),
      };
    });

    const recommendedMembers = scoredMembers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    // 2. Gợi ý sự kiện sắp tới
    const upcomingEvents = events.slice(0, 3).map((ev) => ({
      eventId: ev.eventId,
      title: ev.title,
      eventDate: ev.eventDate,
      location: ev.location,
      importance: 'Cao - Đại lễ truyền thống của dòng tộc',
    }));

    // 3. Gợi ý tài liệu di sản nổi bật
    const featuredHeritage = docs.slice(0, 3).map((d) => ({
      documentId: d.documentId,
      title: d.title,
      type: d.documentType,
      recommendationReason: 'Tài liệu di sản nền tảng gìn giữ văn hóa và gia quy dòng họ',
    }));

    return {
      recommendedMembers,
      upcomingEvents,
      featuredHeritage,
    };
  }
}
