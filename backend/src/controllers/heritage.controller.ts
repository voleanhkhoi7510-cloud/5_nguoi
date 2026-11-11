import type { Request, Response } from 'express';
import prisma from '../db.js';
import { logAudit } from '../middlewares/audit.middleware.js';

function convertBigInt(data: any): any {
  if (typeof data === 'bigint') return data.toString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(convertBigInt);
  if (data !== null && typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(data)) result[key] = convertBigInt(data[key]);
    return result;
  }
  return data;
}

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== LẤY DANH SÁCH TÀI LIỆU DI SẢN ====================
export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');
    const docType = req.query['documentType'] as string | undefined;

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const where: any = { family_id: BigInt(familyIdStr) };
    if (docType) {
      where.document_type = docType;
    }

    const docs = await prisma.family_documents.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        members: { select: { member_id: true, full_name: true } },
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt(
        docs.map((d) => ({
          documentId: `doc_${d.document_id}`,
          title: d.title,
          documentType: d.document_type,
          fileUrl: d.file_url,
          description: d.description,
          createdAt: d.created_at,
          relatedMember: d.members
            ? { memberId: `mem_${d.members.member_id}`, fullName: d.members.full_name }
            : null,
        }))
      ),
    });
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu di sản:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== CHI TIẾT TÀI LIỆU ====================
export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params['id'] ?? '').replace(/^doc_/, '');

    if (!isValidId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID tài liệu không hợp lệ' });
      return;
    }

    const doc = await prisma.family_documents.findUnique({
      where: { document_id: BigInt(id) },
      include: { members: { select: { member_id: true, full_name: true } } },
    });

    if (!doc) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy tài liệu' });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt({
        documentId: `doc_${doc.document_id}`,
        title: doc.title,
        documentType: doc.document_type,
        fileUrl: doc.file_url,
        description: doc.description,
        createdAt: doc.created_at,
        relatedMember: doc.members
          ? { memberId: `mem_${doc.members.member_id}`, fullName: doc.members.full_name }
          : null,
      }),
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tài liệu:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== TẠO MỚI TÀI LIỆU DI SẢN ====================
export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const { familyId, memberId, title, documentType, fileUrl, description } = req.body;

    const familyIdStr = String(familyId ?? '').replace(/^fam_/, '');
    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Tiêu đề tài liệu không được để trống' });
      return;
    }

    const memberIdStr = memberId ? String(memberId).replace(/^mem_/, '') : undefined;
    if (memberIdStr && !isValidId(memberIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'memberId không hợp lệ' });
      return;
    }

    const doc = await prisma.family_documents.create({
      data: {
        family_id: BigInt(familyIdStr),
        member_id: memberIdStr ? BigInt(memberIdStr) : null,
        title: title.trim(),
        document_type: documentType ? String(documentType).trim() : 'HISTORICAL_RECORD',
        file_url: fileUrl ? String(fileUrl).trim() : null,
        description: description ? String(description).trim() : null,
      },
    });

    await logAudit({
      userId,
      action: 'CREATE_DOCUMENT',
      entityType: 'family_documents',
      entityId: doc.document_id.toString(),
      details: `Thêm tài liệu di sản: ${doc.title}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Lưu tài liệu di sản thành công',
      data: convertBigInt(doc),
    });
  } catch (error) {
    console.error('Lỗi khi tạo tài liệu:', error);
    res.status(400).json({ success: false, statusCode: 400, message: 'Không thể thêm tài liệu' });
  }
};

// ==================== CẬP NHẬT TÀI LIỆU ====================
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const id = String(req.params['id'] ?? '').replace(/^doc_/, '');

    if (!isValidId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID tài liệu không hợp lệ' });
      return;
    }

    const { title, documentType, fileUrl, description, memberId } = req.body;
    const data: any = {};

    if (title !== undefined) data.title = String(title).trim();
    if (documentType !== undefined) data.document_type = String(documentType).trim();
    if (fileUrl !== undefined) data.file_url = fileUrl ? String(fileUrl).trim() : null;
    if (description !== undefined) data.description = description ? String(description).trim() : null;
    if (memberId !== undefined) {
      const memIdStr = String(memberId).replace(/^mem_/, '');
      data.member_id = isValidId(memIdStr) ? BigInt(memIdStr) : null;
    }

    const updated = await prisma.family_documents.update({
      where: { document_id: BigInt(id) },
      data,
    });

    await logAudit({
      userId,
      action: 'UPDATE_DOCUMENT',
      entityType: 'family_documents',
      entityId: id,
      details: `Cập nhật tài liệu di sản: ${updated.title}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cập nhật tài liệu thành công',
      data: convertBigInt(updated),
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu:', error);
    res.status(400).json({ success: false, statusCode: 400, message: 'Không thể cập nhật tài liệu' });
  }
};

// ==================== XÓA TÀI LIỆU ====================
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const id = String(req.params['id'] ?? '').replace(/^doc_/, '');

    if (!isValidId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID tài liệu không hợp lệ' });
      return;
    }

    await prisma.family_documents.delete({ where: { document_id: BigInt(id) } });

    await logAudit({
      userId,
      action: 'DELETE_DOCUMENT',
      entityType: 'family_documents',
      entityId: id,
      details: `Xóa tài liệu di sản ID: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, statusCode: 200, message: 'Xóa tài liệu thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa tài liệu:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== PHOTO GALLERY TỔNG HỢP GIA TỘC ====================
export const getPhotoGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const familyId = BigInt(familyIdStr);

    // 1. Ảnh từ bài viết cộng đồng
    const postsWithMedia = await prisma.posts.findMany({
      where: { family_id: familyId, status: 'ACTIVE' },
      select: { post_id: true, content: true, media_urls: true, created_at: true },
    });

    // 2. Ảnh từ sự kiện dòng họ
    const eventsWithMedia = await prisma.events.findMany({
      where: { family_id: familyId },
      select: { event_id: true, title: true, media_urls: true, event_date: true },
    });

    // 3. Ảnh từ tài liệu di sản (loại IMAGE hoặc PHOTO)
    const docsImages = await prisma.family_documents.findMany({
      where: {
        family_id: familyId,
        OR: [
          { document_type: { in: ['IMAGE', 'PHOTO', 'PICTURE', 'PORTRAIT'] } },
          { file_url: { endsWith: '.jpg' } },
          { file_url: { endsWith: '.png' } },
          { file_url: { endsWith: '.webp' } },
        ],
      },
      select: { document_id: true, title: true, file_url: true, created_at: true },
    });

    const gallery: any[] = [];

    // Gộp ảnh bài viết
    for (const p of postsWithMedia) {
      if (Array.isArray(p.media_urls)) {
        for (const url of p.media_urls) {
          gallery.push({
            type: 'POST',
            id: `post_${p.post_id}`,
            url,
            caption: p.content.slice(0, 80),
            date: p.created_at,
          });
        }
      }
    }

    // Gộp ảnh sự kiện
    for (const e of eventsWithMedia) {
      if (Array.isArray(e.media_urls)) {
        for (const url of e.media_urls) {
          gallery.push({
            type: 'EVENT',
            id: `event_${e.event_id}`,
            url,
            caption: e.title,
            date: e.event_date,
          });
        }
      }
    }

    // Gộp ảnh tài liệu
    for (const d of docsImages) {
      if (d.file_url) {
        gallery.push({
          type: 'DOCUMENT',
          id: `doc_${d.document_id}`,
          url: d.file_url,
          caption: d.title,
          date: d.created_at,
        });
      }
    }

    // Sắp xếp mới nhất lên đầu
    gallery.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalPhotos: gallery.length,
        photos: gallery,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thư viện ảnh:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
