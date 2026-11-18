import prisma from '../db.js';
// Chuyển BigInt sang string
function convertBigInt(data) {
    if (typeof data === 'bigint')
        return data.toString();
    if (data instanceof Date)
        return data.toISOString();
    if (Array.isArray(data))
        return data.map(convertBigInt);
    if (data !== null && typeof data === 'object') {
        const result = {};
        for (const key of Object.keys(data)) {
            result[key] = convertBigInt(data[key]);
        }
        return result;
    }
    return data;
}
function isValidId(id) {
    return /^\d+$/.test(id) && BigInt(id) > 0n;
}
// ==================== CÂY GIA PHẢ ====================
export const getGenealogyTree = async (req, res) => {
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
    }
    catch (error) {
        console.error('Lỗi khi lấy dữ liệu cây gia phả:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Lỗi hệ thống máy chủ',
        });
    }
};
// ==================== THÊM THÀNH VIÊN ====================
export const addMember = async (req, res) => {
    try {
        const { familyId, branchId, fullName, gender, generation, birthDate, deathDate, parentId, occupation, education, biography, } = req.body;
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
    }
    catch (error) {
        console.error('Lỗi thêm thành viên:', error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Không thể thêm thành viên',
        });
    }
};
// ==================== TRUY VẤN MỐI QUAN HỆ GIỮA 2 THÀNH VIÊN ====================
export const queryRelationship = async (req, res) => {
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
        }
        else if (directRel) {
            const isAParent = directRel.parent_id.toString() === memberAId;
            const parent = isAParent ? memberA : memberB;
            const child = isAParent ? memberB : memberA;
            relationTitle = 'Cha/Mẹ - Con';
            description = `${parent.full_name} là ${directRel.relationship_type} của ${child.full_name}`;
        }
        else {
            // So sánh thế hệ
            const genDiff = memberA.generation - memberB.generation;
            if (Math.abs(genDiff) === 1) {
                description = `${memberA.full_name} và ${memberB.full_name} cùng dòng họ, chênh lệch 1 thế hệ`;
                relationTitle = 'Có thể là Cha/Mẹ - Con';
            }
            else if (genDiff === 0) {
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
    }
    catch (error) {
        console.error('Lỗi khi truy vấn quan hệ:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Lỗi hệ thống máy chủ',
        });
    }
};
// ==================== THỐNG KÊ DASHBOARD ====================
export const getDashboardStats = async (req, res) => {
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
            if (!m.birth_date || m.death_date)
                continue;
            const age = currentYear - new Date(m.birth_date).getFullYear();
            if (age < 18)
                ageDistribution.under18++;
            else if (age <= 60)
                ageDistribution.from18to60++;
            else
                ageDistribution.above60++;
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
    }
    catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Lỗi hệ thống máy chủ',
        });
    }
};
//# sourceMappingURL=genealogy.controller.js.map