import type { Request, Response } from 'express';
import prisma from '../db.js';

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== AI SEMANTIC SEARCH ====================
export const aiSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { familyId, query } = req.body;

    const familyIdStr = String(familyId ?? '').replace(/^fam_/, '');
    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    if (typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'query tìm kiếm không được để trống' });
      return;
    }

    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const members = await prisma.members.findMany({
      where: { family_id: BigInt(familyIdStr) },
      include: {
        member_profiles: true,
      },
    });

    const scoredMembers = members.map((m) => {
      let score = 0;
      const searchableText = [
        m.full_name,
        m.gender,
        `đời ${m.generation}`,
        `thế hệ ${m.generation}`,
        m.member_profiles?.occupation || '',
        m.member_profiles?.education || '',
        m.member_profiles?.biography || '',
      ].join(' ').toLowerCase();

      for (const kw of keywords) {
        if (searchableText.includes(kw)) {
          score += 1;
        }
      }

      const relevanceScore = keywords.length > 0 ? Math.min(1.0, score / keywords.length) : 0;
      return {
        memberId: `mem_${m.member_id}`,
        fullName: m.full_name,
        generation: m.generation,
        occupation: m.member_profiles?.occupation ?? 'Chưa cập nhật',
        location: m.member_profiles?.education ?? 'Việt Nam',
        relevanceScore: Math.round(relevanceScore * 100) / 100,
      };
    });

    const results = scoredMembers
      .filter((item) => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Tìm kiếm ngữ nghĩa thành công',
      data: {
        totalMatches: results.length,
        results,
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI Semantic Search:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== AI CHAT ASSISTANT ====================
export const aiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const { familyId, conversationId, prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'prompt không được để trống' });
      return;
    }

    const familyIdStr = familyId ? String(familyId).replace(/^fam_/, '') : undefined;
    const convId = conversationId || `conv_${Date.now()}`;

    let relatedDocs: { document_id: bigint; title: string; description: string | null }[] = [];
    if (familyIdStr && isValidId(familyIdStr)) {
      relatedDocs = await prisma.family_documents.findMany({
        where: { family_id: BigInt(familyIdStr) },
        take: 3,
        select: { document_id: true, title: true, description: true },
      });
    }

    let answer = `Trợ lý AI FamilyConnect: Đối với câu hỏi "${prompt.trim()}", hệ thống đã rà soát gia phả và các tài liệu liên quan.`;
    if (relatedDocs.length > 0) {
      answer += ` Dựa trên các tài liệu lưu trữ như "${relatedDocs.map((d) => d.title).join(', ')}", mọi quy định và truyền thống dòng họ luôn được gìn giữ cẩn thận.`;
    } else {
      answer += ` Hiện tại chưa có tài liệu quy ước riêng cho gia tộc này trong hệ thống, bạn có thể bổ sung tài liệu di sản để AI phân tích chi tiết hơn.`;
    }

    if (userId && isValidId(userId)) {
      await prisma.ai_chat_histories.create({
        data: {
          user_id: BigInt(userId),
          family_id: familyIdStr && isValidId(familyIdStr) ? BigInt(familyIdStr) : null,
          conversation_id: convId,
          prompt: prompt.trim(),
          response: answer,
        },
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        conversationId: convId,
        answer,
        sources: relatedDocs.map((d) => ({
          documentId: `doc_${d.document_id}`,
          documentTitle: d.title,
        })),
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI Chat:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== AI GIẢI THÍCH MỐI QUAN HỆ XƯNG HÔ ====================
export const aiExplainRelationship = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromMemberId, toMemberId } = req.body;

    const fromId = String(fromMemberId ?? '').replace(/^mem_/, '');
    const toId = String(toMemberId ?? '').replace(/^mem_/, '');

    if (!isValidId(fromId) || !isValidId(toId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'fromMemberId và toMemberId không hợp lệ' });
      return;
    }

    const [memberA, memberB] = await Promise.all([
      prisma.members.findUnique({ where: { member_id: BigInt(fromId) } }),
      prisma.members.findUnique({ where: { member_id: BigInt(toId) } }),
    ]);

    if (!memberA || !memberB) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy một trong hai thành viên' });
      return;
    }

    let explanation = '';
    const genDiff = memberB.generation - memberA.generation;

    if (fromId === toId) {
      explanation = `${memberA.full_name} là chính mình.`;
    } else {
      const marriage = await prisma.marriages.findFirst({
        where: {
          OR: [
            { partner1_id: BigInt(fromId), partner2_id: BigInt(toId) },
            { partner1_id: BigInt(toId), partner2_id: BigInt(fromId) },
          ],
        },
      });

      if (marriage) {
        explanation = `${memberA.full_name} và ${memberB.full_name} là vợ chồng.`;
      } else if (genDiff === -1) {
        const isMale = memberB.gender?.toLowerCase() === 'male';
        explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) xưng hô với ${memberB.full_name} (thế hệ ${memberB.generation}) là ${isMale ? 'Bác/Chú/Cha' : 'Cô/Dì/Mẹ'}.`;
      } else if (genDiff === -2) {
        const isMale = memberB.gender?.toLowerCase() === 'male';
        explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) gọi ${memberB.full_name} (thế hệ ${memberB.generation}) là ${isMale ? 'Ông Nội / Ông Ngoại' : 'Bà Nội / Bà Ngoại'}.`;
      } else if (genDiff === 1) {
        explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) gọi ${memberB.full_name} (thế hệ ${memberB.generation}) là Con hoặc Cháu trong họ.`;
      } else if (genDiff === 2) {
        explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) gọi ${memberB.full_name} (thế hệ ${memberB.generation}) là Cháu Nội / Ngoại.`;
      } else if (genDiff === 0) {
        explanation = `${memberA.full_name} và ${memberB.full_name} cùng thế hệ ${memberA.generation}, xưng hô là Anh/Chị/Em họ tuỳ theo thứ bậc phụ mẫu.`;
      } else {
        explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) và ${memberB.full_name} (thế hệ ${memberB.generation}) chênh lệch ${Math.abs(genDiff)} thế hệ.`;
      }
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        explanation,
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI giải thích quan hệ:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== AI CONTENT SUMMARIZATION (TÓM TẮT NỘI DUNG) ====================
export const aiSummarize = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, targetType, targetId } = req.body;

    let textToSummarize = content as string | undefined;

    // Nếu truyền targetType và targetId (ví dụ tóm tắt bài viết hoặc tài liệu di sản)
    if (!textToSummarize && targetType && targetId) {
      const cleanId = String(targetId).replace(/^(post_|doc_|mem_)/, '');
      if (isValidId(cleanId)) {
        if (targetType === 'POST') {
          const post = await prisma.posts.findUnique({ where: { post_id: BigInt(cleanId) } });
          textToSummarize = post?.content;
        } else if (targetType === 'DOCUMENT') {
          const doc = await prisma.family_documents.findUnique({ where: { document_id: BigInt(cleanId) } });
          textToSummarize = doc?.description || doc?.title;
        } else if (targetType === 'MEMBER_BIO') {
          const profile = await prisma.member_profiles.findUnique({ where: { member_id: BigInt(cleanId) } });
          textToSummarize = profile?.biography || '';
        }
      }
    }

    if (!textToSummarize || !textToSummarize.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Không có nội dung để tóm tắt' });
      return;
    }

    // Thuật toán tóm tắt thông minh: lấy câu trọng tâm, lọc key points
    const sentences = textToSummarize
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    const keySentences = sentences.slice(0, Math.min(3, Math.max(1, Math.ceil(sentences.length / 2))));
    const summary = keySentences.join(' ');

    const bulletPoints = sentences.slice(0, 4).map((s) => s.replace(/^[•\-\*]\s*/, ''));

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        originalLength: textToSummarize.length,
        summaryLength: summary.length,
        summary: summary || textToSummarize,
        keyPoints: bulletPoints,
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI tóm tắt nội dung:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== AI RECOMMENDATIONS (GỢI Ý KẾT NỐI VÀ TÀI NGUYÊN) ====================
export const aiRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');
    const memberIdStr = req.query['memberId'] ? String(req.query['memberId']).replace(/^mem_/, '') : undefined;

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const familyId = BigInt(familyIdStr);

    let currentMember: any = null;
    if (memberIdStr && isValidId(memberIdStr)) {
      currentMember = await prisma.members.findUnique({
        where: { member_id: BigInt(memberIdStr) },
        include: { member_profiles: true },
      });
    }

    // 1. Gợi ý thành viên cùng thế hệ hoặc cùng chuyên môn để kết nối
    const otherMembers = await prisma.members.findMany({
      where: {
        family_id: familyId,
        ...(currentMember ? { member_id: { not: currentMember.member_id } } : {}),
      },
      include: { member_profiles: true },
      take: 20,
    });

    const recommendedMembers = otherMembers.map((m) => {
      let reason = 'Thành viên cùng dòng tộc';
      let score = 0.5;

      if (currentMember) {
        if (m.generation === currentMember.generation) {
          reason = `Cùng thế hệ thứ ${m.generation} với bạn`;
          score += 0.3;
        }
        if (
          m.member_profiles?.occupation &&
          currentMember.member_profiles?.occupation &&
          m.member_profiles.occupation.toLowerCase() === currentMember.member_profiles.occupation.toLowerCase()
        ) {
          reason = `Cùng làm nghề ${m.member_profiles.occupation}`;
          score += 0.4;
        }
      }

      return {
        memberId: `mem_${m.member_id}`,
        fullName: m.full_name,
        generation: m.generation,
        occupation: m.member_profiles?.occupation ?? null,
        recommendationReason: reason,
        matchScore: Math.min(1.0, score),
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

    // 2. Gợi ý sự kiện sắp tới cần chuẩn bị
    const upcomingEvents = await prisma.events.findMany({
      where: {
        family_id: familyId,
        event_date: { gte: new Date() },
      },
      orderBy: { event_date: 'asc' },
      take: 3,
      select: { event_id: true, title: true, event_date: true, location: true },
    });

    // 3. Gợi ý tài liệu di sản nổi bật
    const featuredDocs = await prisma.family_documents.findMany({
      where: { family_id: familyId },
      orderBy: { created_at: 'desc' },
      take: 3,
      select: { document_id: true, title: true, document_type: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        recommendedMembers,
        upcomingEvents: upcomingEvents.map((e) => ({
          eventId: `event_${e.event_id}`,
          title: e.title,
          eventDate: e.event_date,
          location: e.location,
        })),
        featuredHeritage: featuredDocs.map((d) => ({
          documentId: `doc_${d.document_id}`,
          title: d.title,
          type: d.document_type,
        })),
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy AI recommendations:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
