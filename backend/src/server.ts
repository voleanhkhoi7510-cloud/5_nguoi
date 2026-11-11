import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import prisma from "./db.js";

// Import routers
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import genealogyRouter from "./routes/genealogy.routes.js";
import postsRouter from "./routes/posts.routes.js";
import eventsRouter from "./routes/events.routes.js";
import aiRouter from "./routes/ai.routes.js";
import heritageRouter from "./routes/heritage.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { authenticateJWT } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== HELPER FUNCTIONS ====================

/** Chuyển BigInt và Date sang định dạng JSON hợp lệ */
function convertBigInt(data: any): any {
  if (typeof data === "bigint") return data.toString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(convertBigInt);
  if (data !== null && typeof data === "object") {
    const result: Record<string, any> = {};
    for (const key of Object.keys(data)) result[key] = convertBigInt(data[key]);
    return result;
  }
  return data;
}

/** Kiểm tra ID hợp lệ (số nguyên dương) */
function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// ==================== TRANG CHỦ ====================

app.get("/", (_req, res) => {
  res.json({
    message: "FamilyConnect Backend API",
    version: "1.1.0",
    docs: "/api/v1/health",
  });
});

// ==================== HEALTH CHECK ====================

app.get("/api/v1/health", async (_req, res) => {
  try {
    const result = await prisma.$queryRaw<
      { current_database: string }[]
    >`SELECT current_database()`;

    res.json({
      status: "ok",
      service: "FamilyConnect API",
      database: "connected",
      databaseName: result[0]?.current_database,
    });
  } catch (error) {
    console.error("Lỗi kết nối database:", error);
    res.status(500).json({
      status: "error",
      message: "Cannot connect to PostgreSQL",
    });
  }
});

// ==================== API v1 ROUTES ====================

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/genealogy", genealogyRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/heritage", heritageRouter);
app.use("/api/v1/admin", adminRouter);

// Alias routes theo đúng OpenAPI spec chuẩn
app.use("/api/v1/dashboard", genealogyRouter);
app.use("/api/v1/members", genealogyRouter);

// ==================== LEGACY CRUD ROUTES (giữ lại tương thích) ====================

// --- FAMILIES ---
app.get("/api/families", async (_req, res) => {
  try {
    const families = await prisma.families.findMany({ orderBy: { family_id: "asc" } });
    res.json(convertBigInt(families));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách gia đình" });
  }
});

app.get("/api/families/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id ?? "")) { res.status(400).json({ message: "ID gia đình không hợp lệ" }); return; }
    const family = await prisma.families.findUnique({ where: { family_id: BigInt(req.params.id!) } });
    if (!family) { res.status(404).json({ message: "Không tìm thấy gia đình" }); return; }
    res.json(convertBigInt(family));
  } catch {
    res.status(500).json({ message: "Không thể lấy chi tiết gia đình" });
  }
});

app.post("/api/families", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (typeof name !== "string" || !name.trim()) { res.status(400).json({ message: "Tên gia đình không được để trống" }); return; }
    const family = await prisma.families.create({
      data: { name: name.trim(), description: typeof description === "string" ? description : null },
    });
    res.status(201).json(convertBigInt(family));
  } catch {
    res.status(500).json({ message: "Không thể thêm gia đình" });
  }
});

app.put("/api/families/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id ?? "")) { res.status(400).json({ message: "ID gia đình không hợp lệ" }); return; }
    const { name, description } = req.body;
    if (typeof name !== "string" || !name.trim()) { res.status(400).json({ message: "Tên gia đình không được để trống" }); return; }
    const family = await prisma.families.update({
      where: { family_id: BigInt(req.params.id!) },
      data: { name: name.trim(), description: typeof description === "string" ? description : null },
    });
    res.json(convertBigInt(family));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật gia đình; hãy kiểm tra ID" });
  }
});

app.delete("/api/families/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id ?? "")) { res.status(400).json({ message: "ID gia đình không hợp lệ" }); return; }
    const familyId = BigInt(req.params.id!);
    const member = await prisma.members.findFirst({ where: { family_id: familyId } });
    const familyMember = await prisma.family_members.findFirst({ where: { family_id: familyId } });
    if (member || familyMember) { res.status(409).json({ message: "Không thể xóa gia đình đang có thành viên liên kết" }); return; }
    const family = await prisma.families.delete({ where: { family_id: familyId } });
    res.json({ message: "Đã xóa gia đình thành công", family: convertBigInt(family) });
  } catch {
    res.status(400).json({ message: "Không thể xóa gia đình; có thể ID không tồn tại hoặc còn dữ liệu liên quan" });
  }
});

// --- MEMBERS (legacy) ---
app.get("/api/members", async (_req, res) => {
  try {
    const members = await prisma.members.findMany({ orderBy: { member_id: "asc" } });
    res.json(convertBigInt(members));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách thành viên" });
  }
});

app.get("/api/members/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id ?? "")) { res.status(400).json({ message: "ID thành viên không hợp lệ" }); return; }
    const member = await prisma.members.findUnique({ where: { member_id: BigInt(req.params.id!) } });
    if (!member) { res.status(404).json({ message: "Không tìm thấy thành viên" }); return; }
    res.json(convertBigInt(member));
  } catch {
    res.status(500).json({ message: "Không thể lấy chi tiết thành viên" });
  }
});

app.post("/api/members", async (req, res) => {
  try {
    const { family_id, branch_id, full_name, gender, generation, birth_date, death_date } = req.body;
    if (!isValidId(String(family_id ?? ""))) { res.status(400).json({ message: "family_id không hợp lệ" }); return; }
    if (typeof full_name !== "string" || !full_name.trim()) { res.status(400).json({ message: "Tên thành viên không được để trống" }); return; }
    const member = await prisma.members.create({
      data: {
        family_id: BigInt(family_id),
        branch_id: branch_id == null ? null : BigInt(branch_id),
        full_name: full_name.trim(),
        gender: typeof gender === "string" ? gender : null,
        generation: Number.isInteger(generation) ? generation : 1,
        birth_date: birth_date ? new Date(birth_date) : null,
        death_date: death_date ? new Date(death_date) : null,
      },
    });
    res.status(201).json(convertBigInt(member));
  } catch {
    res.status(400).json({ message: "Không thể thêm thành viên" });
  }
});

app.put("/api/members/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id ?? "")) { res.status(400).json({ message: "ID thành viên không hợp lệ" }); return; }
    const { family_id, branch_id, full_name, gender, generation, birth_date, death_date } = req.body;
    if (!isValidId(String(family_id ?? ""))) { res.status(400).json({ message: "family_id không hợp lệ" }); return; }
    if (typeof full_name !== "string" || !full_name.trim()) { res.status(400).json({ message: "Tên thành viên không được để trống" }); return; }
    const member = await prisma.members.update({
      where: { member_id: BigInt(req.params.id!) },
      data: {
        family_id: BigInt(family_id),
        branch_id: branch_id == null ? null : BigInt(branch_id),
        full_name: full_name.trim(),
        gender: typeof gender === "string" ? gender : null,
        generation: Number.isInteger(generation) ? generation : 1,
        birth_date: birth_date ? new Date(birth_date) : null,
        death_date: death_date ? new Date(death_date) : null,
      },
    });
    res.json(convertBigInt(member));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật thành viên" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id ?? "")) { res.status(400).json({ message: "ID thành viên không hợp lệ" }); return; }
    await prisma.members.delete({ where: { member_id: BigInt(req.params.id!) } });
    res.json({ message: "Đã xóa thành viên" });
  } catch {
    res.status(400).json({ message: "Không thể xóa thành viên" });
  }
});

// --- ROLES ---
app.get("/api/roles", async (_req, res) => {
  try {
    const roles = await prisma.roles.findMany({ orderBy: { role_id: "asc" } });
    res.json(convertBigInt(roles));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách vai trò" });
  }
});

app.post("/api/roles", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (typeof name !== "string" || !name.trim()) { res.status(400).json({ message: "Tên vai trò không được để trống" }); return; }
    const role = await prisma.roles.create({
      data: { name: name.trim(), description: typeof description === "string" ? description : null },
    });
    res.status(201).json(convertBigInt(role));
  } catch {
    res.status(400).json({ message: "Không thể tạo vai trò; tên có thể đã tồn tại" });
  }
});

app.put("/api/roles/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID vai trò không hợp lệ" }); return; }
    const { name, description } = req.body;
    if (name === undefined && description === undefined) { res.status(400).json({ message: "Cần cung cấp thông tin cần cập nhật" }); return; }
    const data: { name?: string; description?: string | null } = {};
    if (name !== undefined) data.name = String(name).trim();
    if (description !== undefined) data.description = description;
    const role = await prisma.roles.update({ where: { role_id: BigInt(id) }, data });
    res.json(convertBigInt(role));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật vai trò" });
  }
});

app.delete("/api/roles/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID vai trò không hợp lệ" }); return; }
    const inUse = await prisma.family_members.findFirst({ where: { role_id: BigInt(id) } });
    if (inUse) { res.status(409).json({ message: "Không thể xóa vai trò đang được sử dụng" }); return; }
    const role = await prisma.roles.delete({
      where: { role_id: BigInt(id) },
      select: { role_id: true, name: true, description: true },
    });
    res.json({ message: "Xóa vai trò thành công", role: convertBigInt(role) });
  } catch {
    res.status(404).json({ message: "Không tìm thấy vai trò hoặc không thể xóa" });
  }
});

// --- USERS (legacy CRUD) ---
app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { user_id: true, full_name: true, email: true, role: true, created_at: true },
      orderBy: { user_id: "asc" },
    });
    res.json(convertBigInt(users));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách tài khoản" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    if (
      typeof full_name !== "string" || !full_name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || password.length < 8
    ) {
      res.status(400).json({ message: "Vui lòng nhập họ tên, email và mật khẩu có ít nhất 8 ký tự" });
      return;
    }
    const password_hash = await bcrypt.hash(password, 12);
    const user = await prisma.users.create({
      data: { full_name: full_name.trim(), email: email.trim().toLowerCase(), password_hash },
      select: { user_id: true, full_name: true, email: true, created_at: true },
    });
    res.status(201).json(convertBigInt(user));
  } catch {
    res.status(400).json({ message: "Không thể tạo tài khoản; email có thể đã tồn tại" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID tài khoản không hợp lệ" }); return; }
    const { full_name, email, password } = req.body;
    if (full_name === undefined && email === undefined && password === undefined) {
      res.status(400).json({ message: "Bạn cần cung cấp ít nhất một trường để cập nhật" }); return;
    }
    const data: { full_name?: string; email?: string; password_hash?: string } = {};
    if (full_name !== undefined) data.full_name = String(full_name).trim();
    if (email !== undefined) data.email = String(email).trim().toLowerCase();
    if (password !== undefined) data.password_hash = await bcrypt.hash(String(password), 12);
    const user = await prisma.users.update({
      where: { user_id: BigInt(id) },
      data,
      select: { user_id: true, full_name: true, email: true, created_at: true },
    });
    res.json(convertBigInt(user));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật tài khoản" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID tài khoản không hợp lệ" }); return; }
    const inUse = await prisma.family_members.findFirst({ where: { user_id: BigInt(id) } });
    if (inUse) { res.status(409).json({ message: "Không thể xóa tài khoản đang liên kết với gia đình" }); return; }
    const user = await prisma.users.delete({
      where: { user_id: BigInt(id) },
      select: { user_id: true, full_name: true, email: true },
    });
    res.json({ message: "Xóa tài khoản thành công", user: convertBigInt(user) });
  } catch {
    res.status(404).json({ message: "Không tìm thấy tài khoản hoặc không thể xóa" });
  }
});

// --- FAMILY MEMBERS (legacy) ---
app.get("/api/family-members", async (_req, res) => {
  try {
    const list = await prisma.family_members.findMany({
      orderBy: { family_member_id: "asc" },
      include: {
        users: { select: { user_id: true, full_name: true, email: true } },
        families: true,
        roles: true,
      },
    });
    res.json(convertBigInt(list));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách thành viên gia đình" });
  }
});

app.post("/api/family-members", async (req, res) => {
  try {
    const { user_id, family_id, role_id } = req.body;
    if (
      !Number.isSafeInteger(user_id) || user_id <= 0 ||
      !Number.isSafeInteger(family_id) || family_id <= 0 ||
      !Number.isSafeInteger(role_id) || role_id <= 0
    ) {
      res.status(400).json({ message: "user_id, family_id và role_id phải là số nguyên dương" }); return;
    }
    const fm = await prisma.family_members.create({
      data: { user_id: BigInt(user_id), family_id: BigInt(family_id), role_id: BigInt(role_id) },
    });
    res.status(201).json(convertBigInt(fm));
  } catch {
    res.status(400).json({ message: "Không thể liên kết. Hãy kiểm tra tài khoản, gia đình, vai trò hoặc liên kết đã tồn tại." });
  }
});

app.put("/api/family-members/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    const { role_id } = req.body;
    if (!isValidId(id) || !Number.isSafeInteger(role_id) || role_id <= 0) {
      res.status(400).json({ message: "ID liên kết hoặc role_id không hợp lệ" }); return;
    }
    const fm = await prisma.family_members.update({
      where: { family_member_id: BigInt(id) },
      data: { role_id: BigInt(role_id) },
    });
    res.json(convertBigInt(fm));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật. Hãy kiểm tra ID liên kết và role_id." });
  }
});

app.delete("/api/family-members/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID liên kết không hợp lệ" }); return; }
    const deleted = await prisma.family_members.delete({ where: { family_member_id: BigInt(id) } });
    res.json({ message: "Đã xóa liên kết thành viên khỏi gia đình", family_member_id: convertBigInt(deleted.family_member_id) });
  } catch {
    res.status(404).json({ message: "Không tìm thấy liên kết thành viên cần xóa" });
  }
});

// --- FAMILY BRANCHES ---
app.get("/api/family-branches", async (req, res) => {
  try {
    const familyIdStr = String(req.query["familyId"] ?? "");
    const where = familyIdStr && isValidId(familyIdStr) ? { family_id: BigInt(familyIdStr) } : {};
    const branches = await prisma.family_branches.findMany({ where, orderBy: { branch_id: "asc" } });
    res.json(convertBigInt(branches));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách chi/nhánh" });
  }
});

app.post("/api/family-branches", async (req, res) => {
  try {
    const { family_id, name, description } = req.body;
    if (!isValidId(String(family_id ?? ""))) { res.status(400).json({ message: "family_id không hợp lệ" }); return; }
    if (typeof name !== "string" || !name.trim()) { res.status(400).json({ message: "Tên chi/nhánh không được để trống" }); return; }
    const branch = await prisma.family_branches.create({
      data: { family_id: BigInt(family_id), name: name.trim(), description: typeof description === "string" ? description : null },
    });
    res.status(201).json(convertBigInt(branch));
  } catch {
    res.status(400).json({ message: "Không thể tạo chi/nhánh" });
  }
});

app.put("/api/family-branches/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID chi/nhánh không hợp lệ" }); return; }
    const { name, description } = req.body;
    if (typeof name !== "string" || !name.trim()) { res.status(400).json({ message: "Tên chi/nhánh không được để trống" }); return; }
    const branch = await prisma.family_branches.update({
      where: { branch_id: BigInt(id) },
      data: { name: name.trim(), description: typeof description === "string" ? description : null },
    });
    res.json(convertBigInt(branch));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật chi/nhánh" });
  }
});

app.delete("/api/family-branches/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID chi/nhánh không hợp lệ" }); return; }
    await prisma.family_branches.delete({ where: { branch_id: BigInt(id) } });
    res.json({ message: "Đã xóa chi/nhánh thành công" });
  } catch {
    res.status(400).json({ message: "Không thể xóa chi/nhánh" });
  }
});

// --- MARRIAGES ---
app.get("/api/marriages", async (req, res) => {
  try {
    const marriages = await prisma.marriages.findMany({
      orderBy: { marriage_id: "asc" },
      include: {
        members_marriages_partner1_idTomembers: { select: { member_id: true, full_name: true } },
        members_marriages_partner2_idTomembers: { select: { member_id: true, full_name: true } },
      },
    });
    res.json(convertBigInt(marriages));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách quan hệ hôn nhân" });
  }
});

app.post("/api/marriages", async (req, res) => {
  try {
    const { partner1_id, partner2_id, start_date, end_date, status } = req.body;
    if (!isValidId(String(partner1_id ?? "")) || !isValidId(String(partner2_id ?? ""))) {
      res.status(400).json({ message: "partner1_id và partner2_id không hợp lệ" }); return;
    }
    if (String(partner1_id) === String(partner2_id)) {
      res.status(400).json({ message: "Hai vợ chồng không thể là cùng một người" }); return;
    }
    const marriage = await prisma.marriages.create({
      data: {
        partner1_id: BigInt(partner1_id),
        partner2_id: BigInt(partner2_id),
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        status: typeof status === "string" ? status : "MARRIED",
      },
    });
    res.status(201).json(convertBigInt(marriage));
  } catch {
    res.status(400).json({ message: "Không thể tạo quan hệ hôn nhân" });
  }
});

app.put("/api/marriages/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID hôn nhân không hợp lệ" }); return; }
    const { start_date, end_date, status } = req.body;
    const data: { start_date?: Date | null; end_date?: Date | null; status?: string } = {};
    if (start_date !== undefined) data.start_date = start_date ? new Date(start_date) : null;
    if (end_date !== undefined) data.end_date = end_date ? new Date(end_date) : null;
    if (status !== undefined) data.status = String(status);
    const marriage = await prisma.marriages.update({ where: { marriage_id: BigInt(id) }, data });
    res.json(convertBigInt(marriage));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật quan hệ hôn nhân" });
  }
});

app.delete("/api/marriages/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID hôn nhân không hợp lệ" }); return; }
    await prisma.marriages.delete({ where: { marriage_id: BigInt(id) } });
    res.json({ message: "Đã xóa quan hệ hôn nhân" });
  } catch {
    res.status(404).json({ message: "Không tìm thấy quan hệ hôn nhân" });
  }
});

// --- PARENT-CHILD RELATIONSHIPS ---
app.get("/api/parent-child", async (_req, res) => {
  try {
    const rels = await prisma.parent_child_relationships.findMany({
      orderBy: { relationship_id: "asc" },
      include: {
        members_parent_child_relationships_parent_idTomembers: { select: { member_id: true, full_name: true } },
        members_parent_child_relationships_child_idTomembers: { select: { member_id: true, full_name: true } },
      },
    });
    res.json(convertBigInt(rels));
  } catch {
    res.status(500).json({ message: "Không thể lấy danh sách quan hệ cha/mẹ-con" });
  }
});

app.post("/api/parent-child", async (req, res) => {
  try {
    const { parent_id, child_id, relationship_type } = req.body;
    if (!isValidId(String(parent_id ?? "")) || !isValidId(String(child_id ?? ""))) {
      res.status(400).json({ message: "parent_id và child_id không hợp lệ" }); return;
    }
    if (String(parent_id) === String(child_id)) {
      res.status(400).json({ message: "Cha/mẹ và con không thể là cùng một người" }); return;
    }
    const rel = await prisma.parent_child_relationships.create({
      data: {
        parent_id: BigInt(parent_id),
        child_id: BigInt(child_id),
        relationship_type: typeof relationship_type === "string" ? relationship_type : "father",
      },
    });
    res.status(201).json(convertBigInt(rel));
  } catch {
    res.status(400).json({ message: "Không thể tạo quan hệ cha/mẹ-con; có thể đã tồn tại" });
  }
});

app.delete("/api/parent-child/:id", async (req, res) => {
  try {
    const id = req.params.id ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID quan hệ không hợp lệ" }); return; }
    await prisma.parent_child_relationships.delete({ where: { relationship_id: BigInt(id) } });
    res.json({ message: "Đã xóa quan hệ cha/mẹ-con" });
  } catch {
    res.status(404).json({ message: "Không tìm thấy quan hệ cần xóa" });
  }
});

// --- MEMBER PROFILES ---
app.get("/api/member-profiles/:memberId", async (req, res) => {
  try {
    const id = req.params.memberId ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID thành viên không hợp lệ" }); return; }
    const profile = await prisma.member_profiles.findUnique({ where: { member_id: BigInt(id) } });
    if (!profile) { res.status(404).json({ message: "Không tìm thấy hồ sơ" }); return; }
    res.json(convertBigInt(profile));
  } catch {
    res.status(500).json({ message: "Không thể lấy hồ sơ thành viên" });
  }
});

app.put("/api/member-profiles/:memberId", async (req, res) => {
  try {
    const id = req.params.memberId ?? "";
    if (!isValidId(id)) { res.status(400).json({ message: "ID thành viên không hợp lệ" }); return; }
    const { occupation, education, biography } = req.body;
    const profile = await prisma.member_profiles.upsert({
      where: { member_id: BigInt(id) },
      update: {
        occupation: typeof occupation === "string" ? occupation : null,
        education: typeof education === "string" ? education : null,
        biography: typeof biography === "string" ? biography : null,
      },
      create: {
        member_id: BigInt(id),
        occupation: typeof occupation === "string" ? occupation : null,
        education: typeof education === "string" ? education : null,
        biography: typeof biography === "string" ? biography : null,
      },
    });
    res.json(convertBigInt(profile));
  } catch {
    res.status(400).json({ message: "Không thể cập nhật hồ sơ thành viên" });
  }
});

// ==================== KHỞI ĐỘNG SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 FamilyConnect Server running at http://localhost:${PORT}`);
  console.log(`📋 API v1: http://localhost:${PORT}/api/v1`);
  console.log(`💚 Health: http://localhost:${PORT}/api/v1/health`);
});
