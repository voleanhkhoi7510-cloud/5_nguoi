import {
  requireRole,
  requirePermission,
  SYSTEM_ROLE_PERMISSIONS,
  FAMILY_ROLE_HIERARCHY,
  requireFamilyAccess,
  requireResourceOwnerOrAdmin,
} from '../src/middlewares/rbac.middleware.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}`);
    if (details) console.error('     Details:', details);
  }
}

function createMockReqRes(userPayload?: any, params: any = {}, body: any = {}, query: any = {}) {
  const req: any = {
    user: userPayload,
    params,
    body,
    query,
    headers: {},
  };

  let statusCode = 200;
  let responseData: any = null;

  const res: any = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    json: (data: any) => {
      responseData = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getResponseData: () => responseData,
  };

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  return { req, res, next, wasNextCalled: () => nextCalled };
}

async function runRBACTests() {
  console.log('================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ HỆ THỐNG PHÂN QUYỀN RBAC & ACCESS CONTROL');
  console.log('================================================================\n');

  // ----------------------------------------------------------------
  // 1. KIỂM THỬ SYSTEM ROLE MATRIX & PERMISSIONS
  // ----------------------------------------------------------------
  console.log('🔹 1. Kiểm thử Ma trận Quyền & Vai trò Hệ thống (System RBAC):');

  assert(
    SYSTEM_ROLE_PERMISSIONS.ADMIN.includes('MANAGE_USERS') &&
    SYSTEM_ROLE_PERMISSIONS.ADMIN.includes('MODERATE_CONTENT') &&
    SYSTEM_ROLE_PERMISSIONS.ADMIN.includes('VIEW_AUDIT_LOGS'),
    'Vai trò ADMIN có đầy đủ quyền quản trị hệ thống'
  );

  assert(
    SYSTEM_ROLE_PERMISSIONS.MODERATOR.includes('MODERATE_CONTENT') &&
    !SYSTEM_ROLE_PERMISSIONS.MODERATOR.includes('MANAGE_USERS'),
    'Vai trò MODERATOR có quyền duyệt bài nhưng không có quyền quản lý người dùng'
  );

  assert(
    SYSTEM_ROLE_PERMISSIONS.MEMBER.includes('POST_COMMUNITY') &&
    !SYSTEM_ROLE_PERMISSIONS.MEMBER.includes('MODERATE_CONTENT'),
    'Vai trò MEMBER chỉ có quyền thành viên cơ bản, không được kiểm duyệt'
  );

  // ----------------------------------------------------------------
  // 2. KIỂM THỬ MIDDLEWARE requireRole
  // ----------------------------------------------------------------
  console.log('\n🔹 2. Kiểm thử Middleware requireRole:');

  // 2.1: ADMIN truy cập endpoint yêu cầu ADMIN
  {
    const { req, res, next, wasNextCalled } = createMockReqRes({ userId: '1', role: 'ADMIN' });
    const middleware = requireRole('ADMIN');
    middleware(req, res, next);
    assert(wasNextCalled(), 'ADMIN được phép đi tiếp (next) vào tài nguyên yêu cầu ADMIN');
  }

  // 2.2: MEMBER truy cập endpoint yêu cầu ADMIN
  {
    const { req, res, next, wasNextCalled } = createMockReqRes({ userId: '2', role: 'MEMBER' });
    const middleware = requireRole('ADMIN');
    middleware(req, res, next);
    assert(!wasNextCalled() && res.getStatusCode() === 403, 'MEMBER bị chặn (403 Forbidden) khi truy cập tài nguyên ADMIN');
  }

  // 2.3: MODERATOR truy cập endpoint cho phép [ADMIN, MODERATOR]
  {
    const { req, res, next, wasNextCalled } = createMockReqRes({ userId: '3', role: 'MODERATOR' });
    const middleware = requireRole('ADMIN', 'MODERATOR');
    middleware(req, res, next);
    assert(wasNextCalled(), 'MODERATOR được phép vào tài nguyên dành cho [ADMIN, MODERATOR]');
  }

  // ----------------------------------------------------------------
  // 3. KIỂM THỬ MIDDLEWARE requirePermission
  // ----------------------------------------------------------------
  console.log('\n🔹 3. Kiểm thử Middleware requirePermission:');

  // 3.1: ADMIN có quyền MANAGE_USERS
  {
    const { req, res, next, wasNextCalled } = createMockReqRes({ userId: '1', role: 'ADMIN' });
    const middleware = requirePermission('MANAGE_USERS');
    middleware(req, res, next);
    assert(wasNextCalled(), 'ADMIN vượt qua kiểm tra quyền MANAGE_USERS');
  }

  // 3.2: MEMBER không có quyền VIEW_AUDIT_LOGS
  {
    const { req, res, next, wasNextCalled } = createMockReqRes({ userId: '2', role: 'MEMBER' });
    const middleware = requirePermission('VIEW_AUDIT_LOGS');
    middleware(req, res, next);
    assert(!wasNextCalled() && res.getStatusCode() === 403, 'MEMBER bị chặn khi thiếu quyền VIEW_AUDIT_LOGS');
  }

  // ----------------------------------------------------------------
  // 4. KIỂM THỬ CẤP BẬC VAI TRÒ GIA ĐÌNH (FAMILY ROLE HIERARCHY)
  // ----------------------------------------------------------------
  console.log('\n🔹 4. Kiểm thử Cấp bậc Vai trò Gia đình (Family Role Hierarchy):');

  assert(FAMILY_ROLE_HIERARCHY.OWNER > FAMILY_ROLE_HIERARCHY.ADMIN, 'Vai trò OWNER cao hơn ADMIN gia đình');
  assert(FAMILY_ROLE_HIERARCHY.ADMIN > FAMILY_ROLE_HIERARCHY.EDITOR, 'Vai trò ADMIN cao hơn EDITOR');
  assert(FAMILY_ROLE_HIERARCHY.EDITOR > FAMILY_ROLE_HIERARCHY.MEMBER, 'Vai trò EDITOR cao hơn MEMBER');
  assert(FAMILY_ROLE_HIERARCHY.MEMBER > FAMILY_ROLE_HIERARCHY.VIEWER, 'Vai trò MEMBER cao hơn VIEWER');

  // ----------------------------------------------------------------
  // 5. KIỂM THỬ BẢO VỆ TÀI NGUYÊN (RESOURCE OWNERSHIP & ADMIN BYPASS)
  // ----------------------------------------------------------------
  console.log('\n🔹 5. Kiểm thử Bảo vệ quyền sở hữu tài nguyên (Resource Ownership):');

  // 5.1: ADMIN hệ thống bypass kiểm tra chủ sở hữu tài nguyên
  {
    const { req, res, next, wasNextCalled } = createMockReqRes(
      { userId: '1', role: 'ADMIN' },
      { id: '10' }
    );
    const middleware = requireResourceOwnerOrAdmin('post', 'id');
    await middleware(req, res, next);
    assert(wasNextCalled(), 'ADMIN hệ thống được phép sửa/xóa bất kỳ bài viết nào mà không cần là tác giả');
  }

  // 5.2: MODERATOR hệ thống bypass kiểm tra chủ sở hữu để kiểm duyệt
  {
    const { req, res, next, wasNextCalled } = createMockReqRes(
      { userId: '3', role: 'MODERATOR' },
      { id: '10' }
    );
    const middleware = requireResourceOwnerOrAdmin('post', 'id');
    await middleware(req, res, next);
    assert(wasNextCalled(), 'MODERATOR hệ thống được phép can thiệp bài viết vi phạm');
  }

  // ----------------------------------------------------------------
  // TỔNG KẾT
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ RBAC:`);
  console.log(`   - Tổng số ca kiểm thử: ${totalTests}`);
  console.log(`   - Thành công (PASS)  : ${passedTests}`);
  console.log(`   - Thất bại (FAIL)    : ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) process.exit(1);
}

runRBACTests().catch((err) => {
  console.error('Lỗi khi chạy RBAC tests:', err);
  process.exit(1);
});
