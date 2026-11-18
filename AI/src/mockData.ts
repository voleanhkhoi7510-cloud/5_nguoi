import type {
  FamilyMemberNode,
  ParentChildEdge,
  MarriageEdge,
  FamilyHeritageDoc,
  FamilyEventData,
  FamilyPostData,
  GenealogyTreeData,
} from './types/index.js';

export const MOCK_FAMILY_ID = '1';
export const MOCK_FAMILY_NAME = 'Dòng họ Nguyễn Văn';

export const MOCK_MEMBERS: FamilyMemberNode[] = [
  // --- THẾ HỆ 1 ---
  {
    memberId: 'mem_1',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Văn Cụ',
    gender: 'male',
    generation: 1,
    birthDate: '1940-04-10',
    deathDate: '2018-10-15',
    occupation: 'Nhà giáo lão thành',
    education: 'Đại học Sư phạm',
    biography: 'Cụ tổ lập nghiệp, nguyên hiệu trưởng trường làng, cả đời cống hiến cho sự nghiệp trồng người.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_2',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Trần Thị Mai',
    gender: 'female',
    generation: 1,
    birthDate: '1943-08-20',
    deathDate: null,
    occupation: 'Cán bộ Y tế về hưu',
    education: 'Trung cấp Y tế',
    biography: 'Cụ bà phúc hậu, người giữ lửa cho gia đình lớn, hiện sống cùng chi trưởng tại TP.HCM.',
    branchName: 'Chi Trưởng Nam Bộ',
  },

  // --- THẾ HỆ 2 ---
  {
    memberId: 'mem_3',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    userId: '2',
    fullName: 'Nguyễn Văn An',
    gender: 'male',
    generation: 2,
    birthDate: '1968-05-15',
    deathDate: null,
    occupation: 'Kỹ sư phần mềm kì cựu & Doanh nhân',
    education: 'Đại học Bách Khoa TP.HCM',
    biography: 'Trưởng nam của cụ Cụ. Hiện là giám đốc công ty công nghệ, tích cực phụ trách ban khuyến học dòng họ.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_4',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Trần Thị Hoa',
    gender: 'female',
    generation: 2,
    birthDate: '1970-09-20',
    deathDate: null,
    occupation: 'Bác sĩ Nhi khoa',
    education: 'Đại học Y Dược',
    biography: 'Vợ ông Nguyễn Văn An, luôn nhiệt tình tham gia các hoạt động thiện nguyện của dòng tộc.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_5',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Văn Đức',
    gender: 'male',
    generation: 2,
    birthDate: '1972-11-03',
    deathDate: null,
    occupation: 'Giảng viên Đại học',
    education: 'Tiến sĩ Vật lý',
    biography: 'Thứ nam của cụ Cụ (em trai ông An). Đang giảng dạy và nghiên cứu tại Đại học Quốc gia.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_6',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Lê Thị Hạnh',
    gender: 'female',
    generation: 2,
    birthDate: '1975-02-14',
    deathDate: null,
    occupation: 'Giáo viên THPT',
    education: 'Đại học Sư phạm',
    biography: 'Vợ ông Nguyễn Văn Đức, phụ trách phong trào văn nghệ và khuyến học trong chi nhánh.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_7',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Thị Thu Hà',
    gender: 'female',
    generation: 2,
    birthDate: '1976-07-28',
    deathDate: null,
    occupation: 'Dược sĩ Cao cấp',
    education: 'Đại học Dược',
    biography: 'Con gái út của cụ Cụ (Cô ruột của Bình và Linh). Hiện định cư và công tác tại Hà Nội.',
    branchName: 'Chi Trưởng Nam Bộ',
  },

  // --- THẾ HỆ 3 ---
  {
    memberId: 'mem_8',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Văn Bình',
    gender: 'male',
    generation: 3,
    birthDate: '1995-03-12',
    deathDate: null,
    occupation: 'Kỹ sư Trí tuệ Nhân tạo',
    education: 'Đại học Bách Khoa',
    biography: 'Con trai trưởng của ông An và bà Hoa. Đại diện cho thế hệ trẻ làm công nghệ tiên tiến.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_9',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Thị Linh',
    gender: 'female',
    generation: 3,
    birthDate: '1998-09-25',
    deathDate: null,
    occupation: 'Chuyên viên Phân tích Tài chính',
    education: 'Đại học Kinh Tế',
    biography: 'Con gái thứ hai của ông An và bà Hoa (em gái ruột của Bình).',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_10',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Văn Cường',
    gender: 'male',
    generation: 3,
    birthDate: '1999-01-10',
    deathDate: null,
    occupation: 'Kiến trúc sư Xây dựng',
    education: 'Đại học Kiến Trúc',
    biography: 'Con trai của ông Đức và bà Hạnh (em họ cùng thế hệ của Bình và Linh).',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_11',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Trần Hoàng Nam',
    gender: 'male',
    generation: 3,
    birthDate: '1994-06-18',
    deathDate: null,
    occupation: 'Luật sư Thương mại',
    education: 'Đại học Luật TP.HCM',
    biography: 'Chồng của Nguyễn Thị Linh (con rể ông An).',
    branchName: 'Chi Trưởng Nam Bộ',
  },

  // --- THẾ HỆ 4 ---
  {
    memberId: 'mem_12',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Nguyễn Hoàng Long',
    gender: 'male',
    generation: 4,
    birthDate: '2022-08-08',
    deathDate: null,
    occupation: 'Thiếu nhi',
    education: 'Mầm non',
    biography: 'Con trai của Nguyễn Văn Bình. Chắt nội của Cụ Cụ và Cụ Mai.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
  {
    memberId: 'mem_13',
    familyId: MOCK_FAMILY_ID,
    branchId: 'branch_1',
    fullName: 'Trần Gia Hân',
    gender: 'female',
    generation: 4,
    birthDate: '2024-01-15',
    deathDate: null,
    occupation: 'Sơ sinh',
    education: null,
    biography: 'Con gái của Nguyễn Thị Linh và Trần Hoàng Nam.',
    branchName: 'Chi Trưởng Nam Bộ',
  },
];

export const MOCK_MARRIAGES: MarriageEdge[] = [
  {
    marriageId: 'm_1',
    partner1Id: 'mem_1',
    partner2Id: 'mem_2',
    startDate: '1965-01-10',
    status: 'MARRIED',
  },
  {
    marriageId: 'm_2',
    partner1Id: 'mem_3',
    partner2Id: 'mem_4',
    startDate: '1993-04-12',
    status: 'MARRIED',
  },
  {
    marriageId: 'm_3',
    partner1Id: 'mem_5',
    partner2Id: 'mem_6',
    startDate: '1997-12-20',
    status: 'MARRIED',
  },
  {
    marriageId: 'm_4',
    partner1Id: 'mem_11',
    partner2Id: 'mem_9',
    startDate: '2021-11-15',
    status: 'MARRIED',
  },
];

export const MOCK_PARENT_CHILD: ParentChildEdge[] = [
  // Thế hệ 1 -> Thế hệ 2 (Cụ Cụ & Cụ Mai -> An, Đức, Hà)
  { relationshipId: 'pc_1', parentId: 'mem_1', childId: 'mem_3', relationshipType: 'father' },
  { relationshipId: 'pc_2', parentId: 'mem_2', childId: 'mem_3', relationshipType: 'mother' },
  { relationshipId: 'pc_3', parentId: 'mem_1', childId: 'mem_5', relationshipType: 'father' },
  { relationshipId: 'pc_4', parentId: 'mem_2', childId: 'mem_5', relationshipType: 'mother' },
  { relationshipId: 'pc_5', parentId: 'mem_1', childId: 'mem_7', relationshipType: 'father' },
  { relationshipId: 'pc_6', parentId: 'mem_2', childId: 'mem_7', relationshipType: 'mother' },

  // Thế hệ 2 -> Thế hệ 3 (An & Hoa -> Bình, Linh)
  { relationshipId: 'pc_7', parentId: 'mem_3', childId: 'mem_8', relationshipType: 'father' },
  { relationshipId: 'pc_8', parentId: 'mem_4', childId: 'mem_8', relationshipType: 'mother' },
  { relationshipId: 'pc_9', parentId: 'mem_3', childId: 'mem_9', relationshipType: 'father' },
  { relationshipId: 'pc_10', parentId: 'mem_4', childId: 'mem_9', relationshipType: 'mother' },

  // Thế hệ 2 -> Thế hệ 3 (Đức & Hạnh -> Cường)
  { relationshipId: 'pc_11', parentId: 'mem_5', childId: 'mem_10', relationshipType: 'father' },
  { relationshipId: 'pc_12', parentId: 'mem_6', childId: 'mem_10', relationshipType: 'mother' },

  // Thế hệ 3 -> Thế hệ 4 (Bình -> Hoàng Long)
  { relationshipId: 'pc_13', parentId: 'mem_8', childId: 'mem_12', relationshipType: 'father' },

  // Thế hệ 3 -> Thế hệ 4 (Linh & Nam -> Gia Hân)
  { relationshipId: 'pc_14', parentId: 'mem_9', childId: 'mem_13', relationshipType: 'mother' },
  { relationshipId: 'pc_15', parentId: 'mem_11', childId: 'mem_13', relationshipType: 'father' },
];

export const MOCK_HERITAGE_DOCS: FamilyHeritageDoc[] = [
  {
    documentId: 'doc_1',
    familyId: MOCK_FAMILY_ID,
    memberId: 'mem_1',
    title: 'Gia quy Tộc Nguyễn Văn - Bản năm 1998',
    documentType: 'FAMILY_RULE',
    description:
      'Gia quy gồm 10 điều răn dạy cốt lõi: 1. Kính thờ tổ tiên, phụng dưỡng cha mẹ khi về già; 2. Giữ trọn tình nghĩa anh em ruột thịt và tôn kính các bậc trưởng thượng; 3. Đề cao học thức, lấy đức hạnh làm gốc rễ; 4. Trung thực, ngay thẳng trong kinh doanh và công việc xã hội; 5. Tương thân tương ái, sẵn sàng giúp đỡ bà con lối xóm và dòng tộc khi gặp hoạn nạn.',
    fileUrl: '/uploads/gia-quy-1998.pdf',
    createdAt: '1998-01-01T00:00:00.000Z',
  },
  {
    documentId: 'doc_2',
    familyId: MOCK_FAMILY_ID,
    memberId: 'mem_1',
    title: 'Văn bia Phả ký Khai sáng Dòng họ Nguyễn Văn',
    documentType: 'HISTORICAL_RECORD',
    description:
      'Tài liệu ghi lại hành trình lập nghiệp của Cụ Nguyễn Văn Cụ từ năm 1960. Từ một thầy giáo nghèo với hai bàn tay trắng, Cụ đã nuôi dạy các con nên người thành đạt và tạo dựng nền tảng vững chắc cho cả dòng tộc.',
    fileUrl: '/uploads/van-bia-pha-ky.pdf',
    createdAt: '2005-06-15T00:00:00.000Z',
  },
  {
    documentId: 'doc_3',
    familyId: MOCK_FAMILY_ID,
    memberId: 'mem_3',
    title: 'Quy chế Quỹ Khuyến học & Khuyến tài Dòng họ',
    documentType: 'GENEALOGY_BOOK',
    description:
      'Quy định khen thưởng con em dòng họ đạt giải học sinh giỏi các cấp, thi đỗ đại học công lập và tốt nghiệp thủ khoa hàng năm. Quỹ được tài trợ bởi ban liên lạc doanh nhân dòng họ.',
    fileUrl: '/uploads/quy-che-khuyen-hoc.pdf',
    createdAt: '2015-08-10T00:00:00.000Z',
  },
];

export const MOCK_EVENTS: FamilyEventData[] = [
  {
    eventId: 'event_1',
    familyId: MOCK_FAMILY_ID,
    creatorId: '1',
    title: 'Đại lễ Giỗ Tổ Dòng họ Nguyễn Văn năm 2026',
    description:
      'Lễ giỗ tổ truyền thống được tổ chức thường niên tại Từ đường họ Nguyễn. Chương trình gồm lễ dâng hương, báo công khuyến học và tiệc liên hoan đại đoàn kết con cháu.',
    eventDate: '2026-04-20T08:30:00.000Z',
    location: 'Nhà thờ từ đường họ Nguyễn, TP. Thủ Đức, TP.HCM',
    attendees: [
      { userId: '1', fullName: 'Quản Trị Viên', status: 'GOING' },
      { userId: '2', fullName: 'Nguyễn Văn An', status: 'GOING' },
      { userId: '3', fullName: 'Nguyễn Văn Bình', status: 'GOING' },
      { userId: '4', fullName: 'Nguyễn Thị Linh', status: 'TENTATIVE' },
    ],
  },
  {
    eventId: 'event_2',
    familyId: MOCK_FAMILY_ID,
    creatorId: '2',
    title: 'Lễ Tuyên dương Khuyến học và Trao học bổng Mùa Thu',
    description:
      'Tuyên dương các cháu thế hệ thứ 3 và thứ 4 đạt thành tích xuất sắc trong học tập, trao phần thưởng và định hướng nghề nghiệp.',
    eventDate: '2026-08-25T09:00:00.000Z',
    location: 'Hội trường Nhà thờ Tộc, TP.HCM',
    attendees: [
      { userId: '2', fullName: 'Nguyễn Văn An', status: 'GOING' },
      { userId: '3', fullName: 'Nguyễn Văn Bình', status: 'GOING' },
    ],
  },
];

export const MOCK_POSTS: FamilyPostData[] = [
  {
    postId: 'post_1',
    familyId: MOCK_FAMILY_ID,
    authorId: '1',
    authorName: 'Quản Trị Viên',
    content:
      'Chào mừng toàn thể con cháu họ Nguyễn Văn đến với nền tảng FamilyConnect. Nơi đây lưu giữ gia phả, kết nối các thế hệ và sẻ chia tình thân ái.',
    isAnnouncement: true,
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    postId: 'post_2',
    familyId: MOCK_FAMILY_ID,
    authorId: '2',
    authorName: 'Nguyễn Văn An',
    content:
      'Nhắc nhở con cháu về ngày Giỗ Tổ sắp tới vào ngày 20/04. Xin mời mọi người vào tab Sự kiện để xác nhận RSVP giúp ban tổ chức sắp xếp chu đáo.',
    isAnnouncement: true,
    createdAt: '2026-03-01T10:00:00.000Z',
  },
];

export const getMockGenealogyTree = (): GenealogyTreeData => ({
  familyId: MOCK_FAMILY_ID,
  familyName: MOCK_FAMILY_NAME,
  nodes: MOCK_MEMBERS,
  parentChildEdges: MOCK_PARENT_CHILD,
  marriageEdges: MOCK_MARRIAGES,
});
