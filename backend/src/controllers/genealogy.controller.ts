import type { Request, Response } from 'express';
import prisma from '../db.js';

// Chuyển BigInt sang string
function convertBigInt(data: any): any {
  if (typeof data === 'bigint') return data.toString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(convertBigInt);
  if (data !== null && typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      result[key] = convertBigInt(data[key]);
    }
    return result;
  }
  return data;
}

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== CÂY GIA PHẢ ====================
export const getGenealogyTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '1');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'familyId không hợp lệ',
      });
      return;
    }

    const familyId = BigInt(familyIdStr);

    const family = await prisma.families.findUnique({
      where: { family_id: familyId },
    });

    if (!family) {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Không tìm thấy thông tin gia tộc',
      });
      return;
    }

    // Lấy danh sách thành viên
    const members = await prisma.members.findMany({
      where: { family_id: familyId },
      orderBy: [{ generation: 'asc' }, { birth_date: 'asc' }],
      include: { member_profiles: true },
    });

    const nodes = members.map((m) => ({
      id: `mem_${m.member_id}`,
      fullName: m.full_name,
      gender: m.gender ? m.gender.toUpperCase() : 'OTHER',
      generation: m.generation,
      birthYear: m.birth_date ? new Date(m.birth_date).getFullYear() : null,
      isAlive: !m.death_date,
      occupation: m.member_profiles?.occupation ?? null,
    }));

    // Lấy quan hệ cha/mẹ-con
    const parentChildRels = await prisma.parent_child_relationships.findMany({
      where: {
        members_parent_child_relationships_parent_idTomembers: {
          family_id: familyId,
        },
      },
    });

    const parentChildEdges = parentChildRels.map((rel) => ({
      id: `rel_pc_${rel.relationship_id}`,
      source: `mem_${rel.parent_id}`,
      target: `mem_${rel.child_id}`,
      relationType: 'PARENT_CHILD',
      relationshipType: rel.relationship_type,
    }));

    // Lấy quan hệ hôn nhân
    const marriages = await prisma.marriages.findMany({
      where: {
        members_marriages_partner1_idTomembers: {
          family_id: familyId,
        },
      },
    });

    const marriageEdges = marriages.map((m) => ({
      id: `rel_m_${m.marriage_id}`,
      source: `mem_${m.partner1_id}`,
      target: `mem_${m.partner2_id}`,
      relationType: 'MARRIAGE',
      status: m.status,
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt({
        familyId: `fam_${family.family_id}`,
        familyName: family.name,
        nodes,
        edges: [...parentChildEdges, ...marriageEdges],
      }),
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu cây gia phả:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống máy chủ',
    });
  }
};

// ==================== THÊM THÀNH VIÊN ====================
export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      familyId,
      branchId,
      fullName,
      gender,
      generation,
      birthDate,
      deathDate,
      parentId,
      occupation,
      education,
      biography,
    } = req.body;

    if (!isValidId(String(familyId ?? ''))) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }
    if (typeof fullName !== 'string' || !fullName.trim()) {
      res.status(400).json({ success: false, statusCode: 400, message: 'fullName không được để trống' });
      return;
    }
    if (typeof generation !== 'number' || !Number.isInteger(generation) || generation < 1) {
      res.status(400).json({ success: false, statusCode: 400, message: 'generation phải là số nguyên dương' });
      return;
    }

    const member = await prisma.members.create({
      data: {
        family_id: BigInt(familyId),
        branch_id: branchId ? BigInt(branchId) : null,
        full_name: fullName.trim(),
        gender: typeof gender === 'string' ? gender.toLowerCase() : null,
        generation,
        birth_date: birthDate ? new Date(birthDate) : null,
        death_date: deathDate ? new Date(deathDate) : null,
      },
    });

    // Tạo profile nếu có
    if (occupation || education || biography) {
      await prisma.member_profiles.create({
        data: {
          member_id: member.member_id,
          occupation: occupation ?? null,
          education: education ?? null,
          biography: biography ?? null,
        },
      });
    }

    // Tạo quan hệ cha/mẹ nếu có
    if (parentId && isValidId(String(parentId))) {
      await prisma.parent_child_relationships.create({
        data: {
          parent_id: BigInt(parentId),
          child_id: member.member_id,
          relationship_type: 'father',
        },
      });
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Thêm thành viên thành công',
      data: convertBigInt(member),
    });
  } catch (error) {
    console.error('Lỗi thêm thành viên:', error);
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Không thể thêm thành viên',
    });
  }
};

// ==================== TRUY VẤN MỐI QUAN HỆ GIỮA 2 THÀNH VIÊN ====================
export const queryRelationship = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberAId = String(req.query['memberAId'] ?? '').replace(/^mem_/, '');
    const memberBId = String(req.query['memberBId'] ?? '').replace(/^mem_/, '');

    if (!isValidId(memberAId) || !isValidId(memberBId)) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'memberAId và memberBId không hợp lệ',
      });
      return;
    }

    const memberA = await prisma.members.findUnique({ where: { member_id: BigInt(memberAId) } });
    const memberB = await prisma.members.findUnique({ where: { member_id: BigInt(memberBId) } });

    if (!memberA || !memberB) {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Không tìm thấy thành viên',
      });
      return;
    }

    // Kiểm tra quan hệ cha/mẹ-con trực tiếp
    const directRel = await prisma.parent_child_relationships.findFirst({
      where: {
        OR: [
          { parent_id: BigInt(memberAId), child_id: BigInt(memberBId) },
          { parent_id: BigInt(memberBId), child_id: BigInt(memberAId) },
        ],
      },
    });

    // Kiểm tra quan hệ hôn nhân
    const marriage = await prisma.marriages.findFirst({
      where: {
        OR: [
          { partner1_id: BigInt(memberAId), partner2_id: BigInt(memberBId) },
          { partner1_id: BigInt(memberBId), partner2_id: BigInt(memberAId) },
        ],
      },
    });

    let relationTitle = 'Không xác định';
    let description = 'Chưa xác định được mối quan hệ trực tiếp';

    if (marriage) {
      relationTitle = 'Vợ - Chồng';
      description = `${memberA.full_name} và ${memberB.full_name} là vợ chồng (${marriage.status ?? 'MARRIED'})`;
    } else if (directRel) {
      const isAParent = directRel.parent_id.toString() === memberAId;
      const parent = isAParent ? memberA : memberB;
      const child = isAParent ? memberB : memberA;
      relationTitle = 'Cha/Mẹ - Con';
      description = `${parent.full_name} là ${directRel.relationship_type} của ${child.full_name}`;
    } else {
      // So sánh thế hệ
      const genDiff = memberA.generation - memberB.generation;
      if (Math.abs(genDiff) === 1) {
        description = `${memberA.full_name} và ${memberB.full_name} cùng dòng họ, chênh lệch 1 thế hệ`;
        relationTitle = 'Có thể là Cha/Mẹ - Con';
      } else if (genDiff === 0) {
        description = `${memberA.full_name} và ${memberB.full_name} cùng thế hệ`;
        relationTitle = 'Cùng thế hệ';
      }
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        memberA: memberA.full_name,
        memberB: memberB.full_name,
        relationTitle,
        description,
      },
    });
  } catch (error) {
    console.error('Lỗi khi truy vấn quan hệ:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống máy chủ',
    });
  }
};

// ==================== THỐNG KÊ DASHBOARD ====================
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const familyId = BigInt(familyIdStr);

    const members = await prisma.members.findMany({
      where: { family_id: familyId },
      select: { gender: true, generation: true, birth_date: true, death_date: true },
    });

    const totalMembers = members.length;
    const totalLiving = members.filter((m) => !m.death_date).length;
    const totalGenerations = members.length > 0
      ? Math.max(...members.map((m) => m.generation))
      : 0;

    const male = members.filter((m) => m.gender?.toLowerCase() === 'male').length;
    const female = members.filter((m) => m.gender?.toLowerCase() === 'female').length;

    const currentYear = new Date().getFullYear();
    const ageDistribution = { under18: 0, from18to60: 0, above60: 0 };

    for (const m of members) {
      if (!m.birth_date || m.death_date) continue;
      const age = currentYear - new Date(m.birth_date).getFullYear();
      if (age < 18) ageDistribution.under18++;
      else if (age <= 60) ageDistribution.from18to60++;
      else ageDistribution.above60++;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalMembers,
        totalLiving,
        totalGenerations,
        genderRatio: { male, female },
        ageDistribution,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống máy chủ',
    });
  }
};

// ==================== LẤY CHI TIẾT 1 THÀNH VIÊN ====================
export const getMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params['id'] ?? '').replace(/^mem_/, '');

    if (!isValidId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID thành viên không hợp lệ' });
      return;
    }

    const member = await prisma.members.findUnique({
      where: { member_id: BigInt(id) },
      include: {
        member_profiles: true,
        family_branches: true,
        families: true,
        parent_child_relationships_parent_child_relationships_child_idTomembers: {
          include: { members_parent_child_relationships_parent_idTomembers: true },
        },
        parent_child_relationships_parent_child_relationships_parent_idTomembers: {
          include: { members_parent_child_relationships_child_idTomembers: true },
        },
        marriages_marriages_partner1_idTomembers: {
          include: { members_marriages_partner2_idTomembers: true },
        },
        marriages_marriages_partner2_idTomembers: {
          include: { members_marriages_partner1_idTomembers: true },
        },
      },
    });

    if (!member) {
      res.status(404).json({ success: false, statusCode: 404, message: 'Không tìm thấy thành viên' });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: convertBigInt(member),
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết thành viên:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== CẬP NHẬT THÀNH VIÊN ====================
export const updateMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params['id'] ?? '').replace(/^mem_/, '');

    if (!isValidId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID thành viên không hợp lệ' });
      return;
    }

    const { fullName, gender, generation, birthDate, deathDate, branchId, occupation, education, biography } = req.body;

    const data: any = {};
    if (fullName) data.full_name = String(fullName).trim();
    if (gender) data.gender = String(gender).toLowerCase();
    if (generation) data.generation = Number(generation);
    if (birthDate !== undefined) data.birth_date = birthDate ? new Date(birthDate) : null;
    if (deathDate !== undefined) data.death_date = deathDate ? new Date(deathDate) : null;
    if (branchId !== undefined) {
      const bId = String(branchId).replace(/^br_/, '');
      data.branch_id = isValidId(bId) ? BigInt(bId) : null;
    }

    const updated = await prisma.members.update({
      where: { member_id: BigInt(id) },
      data,
    });

    // Cập nhật profile nếu có
    if (occupation !== undefined || education !== undefined || biography !== undefined) {
      await prisma.member_profiles.upsert({
        where: { member_id: BigInt(id) },
        update: {
          ...(occupation !== undefined ? { occupation: String(occupation) } : {}),
          ...(education !== undefined ? { education: String(education) } : {}),
          ...(biography !== undefined ? { biography: String(biography) } : {}),
        },
        create: {
          member_id: BigInt(id),
          occupation: occupation ? String(occupation) : null,
          education: education ? String(education) : null,
          biography: biography ? String(biography) : null,
        },
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cập nhật thành viên thành công',
      data: convertBigInt(updated),
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thành viên:', error);
    res.status(400).json({ success: false, statusCode: 400, message: 'Không thể cập nhật thành viên' });
  }
};

// ==================== XÓA THÀNH VIÊN ====================
export const deleteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params['id'] ?? '').replace(/^mem_/, '');

    if (!isValidId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'ID thành viên không hợp lệ' });
      return;
    }

    await prisma.members.delete({ where: { member_id: BigInt(id) } });

    res.status(200).json({ success: true, statusCode: 200, message: 'Đã xóa thành viên thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa thành viên:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== TÌM KIẾM DANH BẠ GIA TỘC (FAMILY DIRECTORY) ====================
export const searchDirectory = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');
    const search = req.query['search'] as string | undefined;
    const profession = req.query['profession'] as string | undefined;
    const location = req.query['location'] as string | undefined;
    const generation = req.query['generation'] ? Number(req.query['generation']) : undefined;

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const where: any = { family_id: BigInt(familyIdStr) };

    if (search) {
      where.full_name = { contains: search, mode: 'insensitive' };
    }

    if (generation) {
      where.generation = generation;
    }

    if (profession || location) {
      where.member_profiles = {};
      if (profession) {
        where.member_profiles.occupation = { contains: profession, mode: 'insensitive' };
      }
      if (location) {
        where.member_profiles.education = { contains: location, mode: 'insensitive' };
      }
    }

    const members = await prisma.members.findMany({
      where,
      orderBy: [{ generation: 'asc' }, { full_name: 'asc' }],
      include: {
        member_profiles: true,
        family_branches: { select: { branch_id: true, name: true } },
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalResults: members.length,
        members: convertBigInt(
          members.map((m) => ({
            memberId: `mem_${m.member_id}`,
            fullName: m.full_name,
            gender: m.gender,
            generation: m.generation,
            birthDate: m.birth_date,
            deathDate: m.death_date,
            branch: m.family_branches?.name ?? null,
            occupation: m.member_profiles?.occupation ?? null,
            education: m.member_profiles?.education ?? null,
            biography: m.member_profiles?.biography ?? null,
          }))
        ),
      },
    });
  } catch (error) {
    console.error('Lỗi khi tra cứu danh bạ gia đình:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== DASHBOARD: HOẠT ĐỘNG CỘNG ĐỒNG ====================
export const getCommunityStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const familyId = BigInt(familyIdStr);

    const [totalPosts, totalComments, totalReactions, announcementsCount] = await Promise.all([
      prisma.posts.count({ where: { family_id: familyId } }),
      prisma.post_comments.count({ where: { posts: { family_id: familyId } } }),
      prisma.post_reactions.count({ where: { posts: { family_id: familyId } } }),
      prisma.posts.count({ where: { family_id: familyId, is_announcement: true } }),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalPosts,
        totalComments,
        totalReactions,
        announcementsCount,
        engagementRate: totalPosts > 0 ? Math.round(((totalComments + totalReactions) / totalPosts) * 100) / 100 : 0,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê cộng đồng:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};

// ==================== DASHBOARD: THỐNG KÊ SỰ KIỆN ====================
export const getEventStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const familyIdStr = String(req.query['familyId'] ?? '').replace(/^fam_/, '');

    if (!isValidId(familyIdStr)) {
      res.status(400).json({ success: false, statusCode: 400, message: 'familyId không hợp lệ' });
      return;
    }

    const familyId = BigInt(familyIdStr);
    const now = new Date();

    const [totalEvents, upcomingEvents, pastEvents, rsvps] = await Promise.all([
      prisma.events.count({ where: { family_id: familyId } }),
      prisma.events.count({ where: { family_id: familyId, event_date: { gte: now } } }),
      prisma.events.count({ where: { family_id: familyId, event_date: { lt: now } } }),
      prisma.event_rsvps.groupBy({
        by: ['status'],
        where: { events: { family_id: familyId } },
        _count: { rsvp_id: true },
      }),
    ]);

    const rsvpStats: Record<string, number> = { GOING: 0, DECLINED: 0, TENTATIVE: 0 };
    for (const r of rsvps) {
      rsvpStats[r.status] = r._count.rsvp_id;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        rsvpStats,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê sự kiện:', error);
    res.status(500).json({ success: false, statusCode: 500, message: 'Lỗi hệ thống máy chủ' });
  }
};
