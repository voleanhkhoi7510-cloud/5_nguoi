import prisma from '../db.js';
function convertBigInt(data) {
    if (typeof data === 'bigint')
        return data.toString();
    if (data instanceof Date)
        return data.toISOString();
    if (Array.isArray(data))
        return data.map(convertBigInt);
    if (data !== null && typeof data === 'object') {
        const result = {};
        for (const key of Object.keys(data))
            result[key] = convertBigInt(data[key]);
        return result;
    }
    return data;
}
function isValidId(id) {
    return /^\d+$/.test(id) && BigInt(id) > 0n;
}
// ==================== LẤY DANH SÁCH BÀI VIẾT ====================
export const getPosts = async (req, res) => {
    try {
        const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');
        const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
        const limit = Math.min(50, Math.max(1, parseInt(String(req.query['limit'] ?? '10'), 10)));
        if (!isValidId(familyIdStr)) {
            res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
            return;
        }
        const familyId = BigInt(familyIdStr);
        const skip = (page - 1) * limit;
        const [total, posts] = await Promise.all([
            prisma.posts.count({ where: { family_id: familyId } }),
            prisma.posts.findMany({
                where: { family_id: familyId },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
                include: {
                    users: { select: { user_id: true, full_name: true, avatar_url: true } },
                    _count: { select: { post_comments: true, post_reactions: true } },
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: convertBigInt(posts.map((p) => ({
                id: p.post_id,
                content: p.content,
                isAnnouncement: p.is_announcement,
                mediaUrls: p.media_urls,
                createdAt: p.created_at,
                author: {
                    id: p.users.user_id,
                    fullName: p.users.full_name,
                    avatarUrl: p.users.avatar_url,
                },
                commentsCount: p._count.post_comments,
                reactionsCount: p._count.post_reactions,
            }))),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
    }
};
// ==================== ĐĂNG BÀI VIẾT ====================
export const createPost = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { familyId, content, isAnnouncement, mediaUrls } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
            return;
        }
        const familyIdStr = String(familyId ?? '').replace(/^fam_/, '');
        if (!isValidId(familyIdStr)) {
            res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
            return;
        }
        if (typeof content !== 'string' || !content.trim()) {
            res.status(400).json({ success: false, statusCode: 400, message: 'Nội dung bài viết không được để trống' });
            return;
        }
        const post = await prisma.posts.create({
            data: {
                family_id: BigInt(familyIdStr),
                author_id: BigInt(userId),
                content: content.trim(),
                is_announcement: Boolean(isAnnouncement),
                media_urls: Array.isArray(mediaUrls) ? mediaUrls.filter((u) => typeof u === 'string') : [],
            },
        });
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Đăng bài viết thành công',
            data: convertBigInt(post),
        });
    }
    catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(400).json({ success: false, statusCode: 400, message: 'Không thể tạo bài viết' });
    }
};
// ==================== XÓA BÀI VIẾT ====================
export const deletePost = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const postId = String(req.params['id'] ?? '');
        if (!isValidId(postId)) {
            res.status(400).json({ success: false, statusCode: 400, message: 'ID bài viết không hợp lệ' });
            return;
        }
        const post = await prisma.posts.findUnique({ where: { post_id: BigInt(postId) } });
        if (!post) {
            res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy bài viết' });
            return;
        }
        // Chỉ tác giả hoặc admin mới được xóa
        const userRole = req.user?.role;
        if (post.author_id.toString() !== userId && userRole !== 'ADMIN') {
            res.status(403).json({ success: false, statusCode: 403, message: 'Không có quyền xóa bài viết này' });
            return;
        }
        await prisma.posts.delete({ where: { post_id: BigInt(postId) } });
        res.status(200).json({ success: true, statusCode: 200, message: 'Xóa bài viết thành công' });
    }
    catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
    }
};
// ==================== THÊM BÌNH LUẬN ====================
export const addComment = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const postId = String(req.params['postId'] ?? '');
        const { content } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
            return;
        }
        if (!isValidId(postId)) {
            res.status(400).json({ success: false, statusCode: 400, message: 'ID bài viết không hợp lệ' });
            return;
        }
        if (typeof content !== 'string' || !content.trim()) {
            res.status(400).json({ success: false, statusCode: 400, message: 'Nội dung bình luận không được để trống' });
            return;
        }
        const comment = await prisma.post_comments.create({
            data: {
                post_id: BigInt(postId),
                author_id: BigInt(userId),
                content: content.trim(),
            },
        });
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Thêm bình luận thành công',
            data: convertBigInt(comment),
        });
    }
    catch (error) {
        console.error('Lỗi khi thêm bình luận:', error);
        res.status(400).json({ success: false, statusCode: 400, message: 'Không thể thêm bình luận' });
    }
};
// ==================== THÊM/XÓA REACT ====================
export const toggleReaction = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const postId = String(req.params['postId'] ?? '');
        const { reactionType } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, statusCode: 401, message: 'Chưa xác thực' });
            return;
        }
        if (!isValidId(postId)) {
            res.status(400).json({ success: false, statusCode: 400, message: 'ID bài viết không hợp lệ' });
            return;
        }
        const existing = await prisma.post_reactions.findFirst({
            where: {
                post_id: BigInt(postId),
                user_id: BigInt(userId),
            },
        });
        if (existing) {
            await prisma.post_reactions.delete({ where: { reaction_id: existing.reaction_id } });
            res.status(200).json({ success: true, statusCode: 200, message: 'Đã bỏ cảm xúc', toggled: false });
        }
        else {
            const reaction = await prisma.post_reactions.create({
                data: {
                    post_id: BigInt(postId),
                    user_id: BigInt(userId),
                    reaction_type: typeof reactionType === 'string' ? reactionType : 'LIKE',
                },
            });
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'Đã thêm cảm xúc',
                toggled: true,
                data: convertBigInt(reaction),
            });
        }
    }
    catch (error) {
        console.error('Lỗi khi toggle reaction:', error);
        res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
    }
};
//# sourceMappingURL=posts.controller.js.map