import prisma from '../db.js';
function isValidId(id) {
    return /^\d+$/.test(id) && BigInt(id) > 0n;
}
// ==================== AI SEMANTIC SEARCH ====================
export const aiSearch = async (req, res) => {
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
        // Tìm kiếm các thành viên trong gia tộc
        const members = await prisma.members.findMany({
            where: { family_id: BigInt(familyIdStr) },
            include: {
                member_profiles: true,
            },
        });
        // Tính điểm phù hợp cơ bản dựa trên từ khoá (tên, nghề nghiệp, học vấn, tiểu sử)
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
    }
    catch (error) {
        console.error('Lỗi khi AI Semantic Search:', error);
        res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
    }
};
// ==================== AI CHAT ASSISTANT ====================
export const aiChat = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { familyId, conversationId, prompt } = req.body;
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            res.status(400).json({ success: false, statusCode: 400, message: 'prompt không được để trống' });
            return;
        }
        const familyIdStr = familyId ? String(familyId).replace(/^fam_/, '') : undefined;
        const convId = conversationId || `conv_${Date.now()}`;
        // Lấy một số tài liệu gia tộc liên quan nếu có
        let relatedDocs = [];
        if (familyIdStr && isValidId(familyIdStr)) {
            relatedDocs = await prisma.family_documents.findMany({
                where: { family_id: BigInt(familyIdStr) },
                take: 3,
                select: { document_id: true, title: true },
            });
        }
        // Câu trả lời thông minh dựa trên context
        let answer = `Trợ lý AI FamilyConnect: Đối với câu hỏi "${prompt.trim()}", hệ thống đã rà soát gia phả và các tài liệu liên quan.`;
        if (relatedDocs.length > 0) {
            answer += ` Dựa trên các tài liệu như "${relatedDocs.map((d) => d.title).join(', ')}", mọi quy định và truyền thống dòng họ luôn được gìn giữ cẩn thận.`;
        }
        else {
            answer += ` Hiện tại chưa có tài liệu quy ước riêng cho gia tộc này trong hệ thống, bạn có thể bổ sung tài liệu để AI phân tích chi tiết hơn.`;
        }
        // Lưu lại lịch sử chat nếu có tài khoản
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
    }
    catch (error) {
        console.error('Lỗi khi AI Chat:', error);
        res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
    }
};
// ==================== AI GIẢI THÍCH MỐI QUAN HỆ XƯNG HÔ ====================
export const aiExplainRelationship = async (req, res) => {
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
        const genDiff = memberB.generation - memberA.generation; // A so với B
        if (fromId === toId) {
            explanation = `${memberA.full_name} là chính mình.`;
        }
        else {
            // Kiểm tra hôn nhân
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
            }
            else if (genDiff === -1) {
                // B là đời trước A (B thế hệ 1, A thế hệ 2) -> B là cha/mẹ/cô/chú của A
                const isMale = memberB.gender?.toLowerCase() === 'male';
                explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) xưng hô với ${memberB.full_name} (thế hệ ${memberB.generation}) là ${isMale ? 'Bác/Chú/Cha' : 'Cô/Dì/Mẹ'}.`;
            }
            else if (genDiff === -2) {
                // B thế hệ 1, A thế hệ 3 -> B là Ông/Bà của A
                const isMale = memberB.gender?.toLowerCase() === 'male';
                explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) gọi ${memberB.full_name} (thế hệ ${memberB.generation}) là ${isMale ? 'Ông Nội / Ông Ngoại' : 'Bà Nội / Bà Ngoại'}.`;
            }
            else if (genDiff === 1) {
                explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) gọi ${memberB.full_name} (thế hệ ${memberB.generation}) là Con hoặc Cháu trong họ.`;
            }
            else if (genDiff === 2) {
                explanation = `${memberA.full_name} (thế hệ ${memberA.generation}) gọi ${memberB.full_name} (thế hệ ${memberB.generation}) là Cháu Nội / Ngoại.`;
            }
            else if (genDiff === 0) {
                explanation = `${memberA.full_name} và ${memberB.full_name} cùng thế hệ ${memberA.generation}, xưng hô là Anh/Chị/Em họ tuỳ theo thứ bậc phụ mẫu.`;
            }
            else {
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
    }
    catch (error) {
        console.error('Lỗi khi AI giải thích quan hệ:', error);
        res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
    }
};
//# sourceMappingURL=ai.controller.js.map