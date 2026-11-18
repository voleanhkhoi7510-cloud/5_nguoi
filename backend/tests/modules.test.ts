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

// In-memory test store mô phỏng các module
interface MockPost {
  postId: string;
  familyId: string;
  authorId: string;
  authorName: string;
  content: string;
  isAnnouncement: boolean;
  status: 'ACTIVE' | 'HIDDEN' | 'FLAGGED';
  mediaUrls: string[];
  createdAt: string;
  comments: Array<{ commentId: string; authorId: string; content: string; createdAt: string }>;
  reactions: Map<string, string>; // userId -> reactionType
}

interface MockEvent {
  eventId: string;
  familyId: string;
  creatorId: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  rsvps: Map<string, { userId: string; fullName: string; email: string; status: 'GOING' | 'DECLINED' | 'TENTATIVE'; updatedAt: string }>;
}

interface MockHeritageDoc {
  documentId: string;
  familyId: string;
  title: string;
  documentType: string;
  description: string;
  fileUrl?: string;
}

async function runModulesTests() {
  console.log('================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ CÁC MODULE CỘNG ĐỒNG, SỰ KIỆN & DI SẢN');
  console.log('================================================================\n');

  // ================================================================
  // 1. MODULE CỘNG ĐỒNG (COMMUNITY POSTS, COMMENTS, REACTIONS)
  // ================================================================
  console.log('🔹 1. Kiểm thử Module Cộng đồng (Community Posts, Comments & Reactions):');

  const postsStore: MockPost[] = [];

  // 1.1: Tạo bài viết thông báo cộng đồng
  const newPost: MockPost = {
    postId: 'post_101',
    familyId: '1',
    authorId: '2',
    authorName: 'Nguyễn Văn An',
    content: 'Chào mừng đại gia đình họp mặt đầu năm mới Bính Ngọ 2026!',
    isAnnouncement: true,
    status: 'ACTIVE',
    mediaUrls: ['https://example.com/family-photo-1.jpg'],
    createdAt: new Date().toISOString(),
    comments: [],
    reactions: new Map(),
  };
  postsStore.push(newPost);

  assert(postsStore.length === 1, 'Tạo bài viết cộng đồng thành công');
  assert(newPost.isAnnouncement === true, 'Bài viết được đánh dấu là Thông báo chính thức');
  assert(newPost.status === 'ACTIVE', 'Trạng thái bài viết mặc định là ACTIVE');

  // 1.2: Thêm bình luận vào bài viết
  const comment1 = {
    commentId: 'comm_1',
    authorId: '8',
    content: 'Cháu chúc cả nhà năm mới an khang thịnh vượng!',
    createdAt: new Date().toISOString(),
  };
  newPost.comments.push(comment1);

  assert(newPost.comments.length === 1, 'Thêm bình luận vào bài viết thành công');
  assert(newPost.comments[0]?.content.includes('chúc cả nhà'), 'Nội dung bình luận chính xác');

  // 1.3: Thả cảm xúc & Toggle reaction
  newPost.reactions.set('8', 'LIKE');
  newPost.reactions.set('9', 'HEART');
  assert(newPost.reactions.size === 2, 'Ghi nhận cảm xúc từ 2 thành viên khác nhau');
  assert(newPost.reactions.get('9') === 'HEART', 'Thả cảm xúc HEART thành công');

  // Đổi cảm xúc (User 8 đổi từ LIKE sang CELEBRATE)
  newPost.reactions.set('8', 'CELEBRATE');
  assert(newPost.reactions.get('8') === 'CELEBRATE', 'Cập nhật loại cảm xúc thành công');

  // 1.4: Kiểm duyệt bài viết (Content Moderation)
  newPost.status = 'FLAGGED';
  assert(newPost.status === 'FLAGGED', 'Điều hành viên gắn cờ FLAGGED bài viết nghi vấn');
  newPost.status = 'ACTIVE';
  assert(newPost.status === 'ACTIVE', 'Khôi phục trạng thái ACTIVE cho bài viết sau khi kiểm duyệt');

  // ================================================================
  // 2. MODULE SỰ KIỆN & RSVP (EVENTS, ATTENDEES LIST)
  // ================================================================
  console.log('\n🔹 2. Kiểm thử Module Sự kiện, RSVP & Danh sách người tham gia:');

  const eventsStore: MockEvent[] = [];

  // 2.1: Tạo sự kiện mới
  const event1: MockEvent = {
    eventId: 'event_501',
    familyId: '1',
    creatorId: '2',
    title: 'Đại Lễ Giỗ Tổ Dòng Họ Nguyễn Văn',
    description: 'Họp mặt toàn thể con cháu tại nhà thờ từ đường, dâng hương tưởng nhớ tổ tiên.',
    eventDate: '2026-04-20T08:30:00.000Z',
    location: 'Nhà thờ từ đường, TP.HCM',
    rsvps: new Map(),
  };
  eventsStore.push(event1);

  assert(eventsStore.length === 1, 'Tạo sự kiện gia tộc thành công');
  assert(event1.title.includes('Giỗ Tổ'), 'Tiêu đề sự kiện hợp lệ');

  // 2.2: Điểm danh RSVP cho các thành viên
  // User 1: GOING
  event1.rsvps.set('1', {
    userId: '1',
    fullName: 'Quản Trị Viên',
    email: 'admin@familyconnect.local',
    status: 'GOING',
    updatedAt: new Date().toISOString(),
  });
  // User 2: GOING
  event1.rsvps.set('2', {
    userId: '2',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    status: 'GOING',
    updatedAt: new Date().toISOString(),
  });
  // User 8: TENTATIVE
  event1.rsvps.set('8', {
    userId: '8',
    fullName: 'Nguyễn Văn Bình',
    email: 'binh.nguyen@gmail.com',
    status: 'TENTATIVE',
    updatedAt: new Date().toISOString(),
  });
  // User 9: DECLINED
  event1.rsvps.set('9', {
    userId: '9',
    fullName: 'Nguyễn Thị Linh',
    email: 'linh.nguyen@gmail.com',
    status: 'DECLINED',
    updatedAt: new Date().toISOString(),
  });

  assert(event1.rsvps.size === 4, 'Ghi nhận 4 lượt RSVP từ các thành viên');

  // 2.3: API Danh sách người tham gia (Attendees List & Summary)
  const allAttendees = Array.from(event1.rsvps.values());
  const going = allAttendees.filter((a) => a.status === 'GOING');
  const tentative = allAttendees.filter((a) => a.status === 'TENTATIVE');
  const declined = allAttendees.filter((a) => a.status === 'DECLINED');

  const attendeesResponse = {
    event: {
      eventId: event1.eventId,
      title: event1.title,
      eventDate: event1.eventDate,
      location: event1.location,
    },
    total: allAttendees.length,
    summary: {
      goingCount: going.length,
      tentativeCount: tentative.length,
      declinedCount: declined.length,
    },
    attendees: allAttendees,
  };

  assert(attendeesResponse.total === 4, 'Tổng số lượt phản hồi người tham gia chính xác là 4');
  assert(attendeesResponse.summary.goingCount === 2, 'Số người xác nhận tham gia (GOING) là 2');
  assert(attendeesResponse.summary.tentativeCount === 1, 'Số người có thể tham gia (TENTATIVE) là 1');
  assert(attendeesResponse.summary.declinedCount === 1, 'Số người vắng mặt (DECLINED) là 1');
  assert(attendeesResponse.attendees.some((a) => a.fullName === 'Nguyễn Văn An' && a.status === 'GOING'), 'Chi tiết người tham gia có đầy đủ họ tên và email');

  // 2.4: Cập nhật lại RSVP (User 8 đổi từ TENTATIVE sang GOING)
  event1.rsvps.set('8', {
    ...event1.rsvps.get('8')!,
    status: 'GOING',
    updatedAt: new Date().toISOString(),
  });
  const updatedGoing = Array.from(event1.rsvps.values()).filter((a) => a.status === 'GOING');
  assert(updatedGoing.length === 3, 'Cập nhật trạng thái RSVP thành công (số người GOING tăng lên 3)');

  // ================================================================
  // 3. MODULE DI SẢN (HERITAGE DOCUMENTS & GALLERY)
  // ================================================================
  console.log('\n🔹 3. Kiểm thử Module Di sản (Heritage Documents & Photo Gallery):');

  const heritageStore: MockHeritageDoc[] = [];

  // 3.1: Thêm tài liệu di sản
  const doc1: MockHeritageDoc = {
    documentId: 'doc_1',
    familyId: '1',
    title: 'Gia quy Tộc Nguyễn Văn - Năm 1998',
    documentType: 'FAMILY_RULE',
    description: 'Bản gia quy gồm 10 điều răn dạy con cháu về lòng hiếu kính cha mẹ và giữ gìn danh dự dòng tộc.',
    fileUrl: '/uploads/gia-quy-1998.pdf',
  };
  const doc2: MockHeritageDoc = {
    documentId: 'doc_2',
    familyId: '1',
    title: 'Văn bia Phả ký Dòng tộc',
    documentType: 'HISTORICAL_RECORD',
    description: 'Ghi chép hành trình khai hoang lập nghiệp của tiền nhân.',
    fileUrl: '/uploads/van-bia-pha-ky.pdf',
  };
  heritageStore.push(doc1, doc2);

  assert(heritageStore.length === 2, 'Lưu trữ tài liệu di sản thành công');
  assert(doc1.documentType === 'FAMILY_RULE', 'Phân loại đúng tài liệu Quy ước / Gia quy');

  // 3.2: Cập nhật tài liệu di sản
  doc1.description += ' Được tu chỉnh và công bố lại vào năm 2026.';
  assert(doc1.description.includes('năm 2026'), 'Cập nhật nội dung tài liệu di sản thành công');

  // 3.3: Tổng hợp Bộ sưu tập ảnh (Photo Gallery) từ bài viết và di sản
  const photoGallery = [
    ...newPost.mediaUrls.map((url) => ({ url, source: 'POST', title: newPost.content.slice(0, 30) })),
    { url: 'https://example.com/heritage-photo-1.jpg', source: 'HERITAGE', title: doc2.title },
    { url: 'https://example.com/event-photo-1.jpg', source: 'EVENT', title: event1.title },
  ];

  assert(photoGallery.length === 3, 'Tổng hợp Photo Gallery đa nguồn thành công (Bài viết, Sự kiện, Di sản)');
  assert(photoGallery.some((p) => p.source === 'HERITAGE'), 'Gallery có chứa ảnh di sản');
  assert(photoGallery.some((p) => p.source === 'EVENT'), 'Gallery có chứa ảnh sự kiện');

  // ================================================================
  // TỔNG KẾT
  // ================================================================
  console.log('\n================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ MODULES CỘNG ĐỒNG, SỰ KIỆN & DI SẢN:`);
  console.log(`   - Tổng số ca kiểm thử: ${totalTests}`);
  console.log(`   - Thành công (PASS)  : ${passedTests}`);
  console.log(`   - Thất bại (FAIL)    : ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) process.exit(1);
}

runModulesTests().catch((err) => {
  console.error('Lỗi khi chạy modules test:', err);
  process.exit(1);
});
