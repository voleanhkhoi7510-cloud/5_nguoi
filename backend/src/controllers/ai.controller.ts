import type { Request, Response } from 'express';
import prisma from '../db.js';
import { FamilyAIService } from '../../../AI/dist/index.js';

// Khởi tạo AI Service kết nối với Prisma Client của Backend
const aiService = new FamilyAIService({
  prismaClient: prisma,
  preferDatabase: true,
});

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== 1. AI SEMANTIC SEARCH ====================
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

    const results = await aiService.semanticSearch(familyIdStr, query.trim(), 10);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Tìm kiếm ngữ nghĩa thành công',
      data: {
        totalMatches: results.length,
        results: results.map((r) => ({
          id: r.id,
          type: r.type,
          title: r.title,
          content: r.content,
          relevanceScore: r.score ? Math.round(r.score * 10) / 100 : 0.5,
          metadata: r.metadata,
        })),
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI Semantic Search:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== 2. AI CHAT ASSISTANT & Q&A ====================
export const aiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const { familyId, conversationId, prompt, currentMemberId } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'prompt không được để trống' });
      return;
    }

    const familyIdStr = familyId ? String(familyId).replace(/^fam_/, '') : '1';

    const qaResult = await aiService.askQuestion({
      familyId: familyIdStr,
      prompt: prompt.trim(),
      conversationId: conversationId || undefined,
      userId: userId || undefined,
      currentMemberId: currentMemberId ? String(currentMemberId).replace(/^mem_/, '') : undefined,
    });

    // Lưu vào cơ sở dữ liệu nếu có kết nối DB
    if (userId && isValidId(userId)) {
      try {
        await prisma.ai_chat_histories.create({
          data: {
            user_id: BigInt(userId),
            family_id: isValidId(familyIdStr) ? BigInt(familyIdStr) : null,
            conversation_id: qaResult.conversationId,
            prompt: prompt.trim(),
            response: qaResult.answer,
          },
        });
      } catch (err) {
        // Tiếp tục trả kết quả nếu lưu DB gặp lỗi nhẹ
      }
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        conversationId: qaResult.conversationId,
        answer: qaResult.answer,
        intent: qaResult.intent,
        confidence: qaResult.confidence,
        sources: qaResult.sources,
        suggestedFollowUps: qaResult.suggestedFollowUps,
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI Chat:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== 3. AI GIẢI THÍCH MỐI QUAN HỆ XƯNG HÔ ====================
export const aiExplainRelationship = async (req: Request, res: Response): Promise<void> => {
  try {
    const { familyId, fromMemberId, toMemberId } = req.body;

    const famId = familyId ? String(familyId).replace(/^fam_/, '') : '1';
    const fromId = String(fromMemberId ?? '').replace(/^mem_/, '');
    const toId = String(toMemberId ?? '').replace(/^mem_/, '');

    if (!isValidId(fromId) || !isValidId(toId)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'fromMemberId và toMemberId không hợp lệ' });
      return;
    }

    const analysis = await aiService.explainRelationship(famId, fromId, toId);

    if (!analysis) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy thông tin thành viên trên cây gia phả' });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        memberA: analysis.fromMember.fullName,
        memberB: analysis.toMember.fullName,
        relationTitle: analysis.relationTitle,
        generationDiff: analysis.generationDiff,
        explanation: analysis.detailedExplanation,
        path: analysis.pathDescription,
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI giải thích quan hệ:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== 4. AI TÓM TẮT NỘI DUNG (SUMMARIZATION) ====================
export const aiSummarize = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, targetType, targetId } = req.body;

    let textToSummarize = content as string | undefined;

    if (!textToSummarize && targetType && targetId) {
      const cleanId = String(targetId).replace(/^(post_|doc_|mem_)/, '');
      if (isValidId(cleanId)) {
        try {
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
        } catch {}
      }
    }

    if (!textToSummarize || !textToSummarize.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Không có nội dung để tóm tắt' });
      return;
    }

    const { summary, keyPoints } = aiService.summarizeText(textToSummarize);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        originalLength: textToSummarize.length,
        summaryLength: summary.length,
        summary,
        keyPoints,
      },
    });
  } catch (error) {
    console.error('Lỗi khi AI tóm tắt nội dung:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== 5. AI GỢI Ý KẾT NỐI & TÀI NGUYÊN (RECOMMENDATIONS) ====================
export const aiRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '1').replace(/^fam_/, '');
    const memberIdStr = req.query['memberId'] ? String(req.query['memberId']).replace(/^mem_/, '') : undefined;

    const recommendations = await aiService.getRecommendations(familyIdStr, memberIdStr);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: recommendations,
    });
  } catch (error) {
    console.error('Lỗi khi lấy AI recommendations:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
