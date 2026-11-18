import { FamilyAIService } from '../src/index.js';
import { MOCK_FAMILY_ID } from '../src/mockData.js';

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

async function runAITests() {
  console.log('================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN KHUNG AI SERVICE & PHẢ HỆ');
  console.log('================================================================\n');

  const aiService = new FamilyAIService();

  // ----------------------------------------------------------------
  // 1. KIỂM THỬ CÂY GIA PHẢ (GENEALOGY TREE)
  // ----------------------------------------------------------------
  console.log('🔹 1. Kiểm thử Cây gia phả (Genealogy Tree Structure):');
  const tree = await aiService.getTree(MOCK_FAMILY_ID);

  assert(tree !== null && tree !== undefined, 'Lấy dữ liệu cây gia phả thành công');
  assert(tree.nodes.length >= 10, `Cây gia phả có đủ số lượng thành viên (${tree.nodes.length} thành viên)`);
  assert(tree.parentChildEdges.length >= 10, `Có đủ các cạnh quan hệ cha mẹ - con (${tree.parentChildEdges.length} cạnh)`);
  assert(tree.marriageEdges.length >= 3, `Có đủ các cạnh quan hệ hôn nhân (${tree.marriageEdges.length} cạnh)`);

  const generations = Array.from(new Set(tree.nodes.map((n) => n.generation)));
  assert(generations.includes(1) && generations.includes(4), 'Cây gia phả phủ rộng đủ 4 thế hệ (từ cụ tổ đến chắt)');

  // ----------------------------------------------------------------
  // 2. KIỂM THỬ THUẬT TOÁN QUAN HỆ & DANH XƯNG VIỆT NAM (RELATIONSHIP ENGINE)
  // ----------------------------------------------------------------
  console.log('\n🔹 2. Kiểm thử Thuật toán quan hệ & Danh xưng xưng hô Việt Nam:');

  // Test 2.1: Quan hệ Vợ - Chồng
  const relMarriage = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_1', 'mem_2');
  assert(relMarriage?.relationTitle === 'Vợ', 'Cụ Cụ và Cụ Mai có quan hệ Vợ - Chồng');

  // Test 2.2: Quan hệ Cha - Con ruột
  const relFatherSon = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_3', 'mem_8');
  assert(relFatherSon?.relationTitle === 'Con trai', 'Ông An gọi Bình là Con trai');

  // Test 2.3: Quan hệ Con gọi Cha ruột
  const relChildFather = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_8', 'mem_3');
  assert(relChildFather?.relationTitle === 'Cha ruột', 'Bình gọi Ông An là Cha ruột');

  // Test 2.4: Quan hệ Ông Nội - Cháu Nội
  const relGrandFather = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_8', 'mem_1');
  assert(relGrandFather?.relationTitle === 'Ông Nội', 'Bình gọi Cụ Cụ là Ông Nội');

  // Test 2.5: Quan hệ Cháu Nội gọi Bà Nội
  const relGrandMother = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_8', 'mem_2');
  assert(relGrandMother?.relationTitle === 'Bà Nội', 'Bình gọi Cụ Mai là Bà Nội');

  // Test 2.6: Quan hệ Bác / Chú (Đức là em trai An, Bình là con An => Bình gọi Đức là Chú)
  const relUncle = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_8', 'mem_5');
  assert(relUncle?.relationTitle.includes('Chú'), `Bình gọi Ông Đức là Chú (kết quả: ${relUncle?.relationTitle})`);

  // Test 2.7: Quan hệ Anh Em ruột (Bình và Linh cùng cha mẹ An & Hoa)
  const relSibling = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_8', 'mem_9');
  assert(relSibling?.relationTitle.includes('Em gái ruột'), `Bình gọi Linh là Em gái ruột (kết quả: ${relSibling?.relationTitle})`);

  // Test 2.8: Quan hệ Anh Em họ (Bình và Cường: con của 2 anh em ruột An & Đức)
  const relCousin = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_8', 'mem_10');
  assert(
    relCousin?.relationTitle.includes('Em trai họ') || relCousin?.relationTitle.includes('Anh họ'),
    `Bình và Cường là Anh Em họ đồng tộc (kết quả: ${relCousin?.relationTitle})`
  );

  // Test 2.9: Quan hệ Cụ - Chắt (Thế hệ 1 cách thế hệ 4 ba đời)
  const relGreatGrand = await aiService.explainRelationship(MOCK_FAMILY_ID, 'mem_12', 'mem_1');
  assert(relGreatGrand?.relationTitle === 'Cụ Ông', `Hoàng Long (Gen 4) gọi Cụ Cụ (Gen 1) là Cụ Ông (kết quả: ${relGreatGrand?.relationTitle})`);

  // ----------------------------------------------------------------
  // 3. KIỂM THỬ TRUY XUẤT DỮ LIỆU THỬ NGHIỆM & SEMANTIC SEARCH
  // ----------------------------------------------------------------
  console.log('\n🔹 3. Kiểm thử Cơ chế truy xuất dữ liệu & Semantic Search:');

  const searchTech = await aiService.semanticSearch(MOCK_FAMILY_ID, 'công nghệ trí tuệ nhân tạo');
  assert(searchTech.length > 0, 'Tìm kiếm thành viên ngành công nghệ thành công');
  assert(
    searchTech.some((r) => r.title.includes('Bình') || r.content.includes('Trí tuệ Nhân tạo')),
    'Kết quả tìm kiếm phản ánh đúng hồ sơ thành viên Nguyễn Văn Bình'
  );

  const searchHeritage = await aiService.semanticSearch(MOCK_FAMILY_ID, 'gia quy điều răn hiếu thảo');
  assert(searchHeritage.length > 0, 'Truy xuất tài liệu gia quy và điều răn thành công');
  assert(
    searchHeritage.some((r) => r.title.includes('Gia quy') || r.type === 'DOCUMENT'),
    'Kết quả truy xuất chính xác tài liệu Gia quy Tộc Nguyễn Văn'
  );

  // ----------------------------------------------------------------
  // 4. KIỂM THỬ KHUNG AI Q&A NGUYÊN MẪU (FAMILY QA ENGINE)
  // ----------------------------------------------------------------
  console.log('\n🔹 4. Kiểm thử AI Q&A nguyên mẫu dựa trên dữ liệu gia đình:');

  // Test 4.1: Q&A hỏi về mối quan hệ xưng hô
  const qaRel = await aiService.askQuestion({
    familyId: MOCK_FAMILY_ID,
    prompt: 'Nguyễn Văn An và Nguyễn Văn Bình xưng hô với nhau như thế nào?',
  });
  assert(qaRel.intent === 'RELATIONSHIP_QUERY', 'Nhận diện đúng ý định RELATIONSHIP_QUERY');
  assert(qaRel.answer.includes('Bình') && qaRel.answer.includes('An'), 'Câu trả lời chứa đầy đủ tên 2 thành viên');
  assert(qaRel.sources.length > 0, 'Câu trả lời có dẫn chứng nguồn thông tin phả hệ');

  // Test 4.2: Q&A hỏi về gia quy và truyền thống
  const qaHeritage = await aiService.askQuestion({
    familyId: MOCK_FAMILY_ID,
    prompt: 'Gia quy dòng họ có những quy định gì về lòng hiếu kính cha mẹ?',
  });
  assert(qaHeritage.intent === 'HERITAGE_RULES', 'Nhận diện đúng ý định HERITAGE_RULES');
  assert(qaHeritage.answer.includes('Gia quy'), 'Câu trả lời trích xuất đúng tài liệu Gia quy');
  assert(qaHeritage.sources.some((s) => s.type === 'DOCUMENT'), 'Dẫn chứng nguồn tài liệu di sản DOCUMENT');

  // Test 4.3: Q&A hỏi về sự kiện dòng họ
  const qaEvent = await aiService.askQuestion({
    familyId: MOCK_FAMILY_ID,
    prompt: 'Dòng họ sắp tới có sự kiện gì và diễn ra ở đâu?',
  });
  assert(qaEvent.intent === 'EVENT_INFO', 'Nhận diện đúng ý định EVENT_INFO');
  assert(qaEvent.answer.includes('Giỗ Tổ') || qaEvent.answer.includes('Khuyến học'), 'Cung cấp thông tin các sự kiện lớn');
  assert(qaEvent.answer.includes('RSVP') || qaEvent.answer.includes('tham gia'), 'Cung cấp thông tin người tham gia sự kiện');

  // Test 4.4: Q&A hỏi về thống kê tổng quan
  const qaStats = await aiService.askQuestion({
    familyId: MOCK_FAMILY_ID,
    prompt: 'Gia đình có bao nhiêu thế hệ và tổng số bao nhiêu người?',
  });
  assert(qaStats.intent === 'STATISTICS_SUMMARY', 'Nhận diện đúng ý định STATISTICS_SUMMARY');
  assert(qaStats.answer.includes('thế hệ') && qaStats.answer.includes('thành viên'), 'Thống kê chính xác số lượng thành viên và thế hệ');

  // ----------------------------------------------------------------
  // 5. KIỂM THỬ RECOMMENDATIONS VÀ SUMMARIZATION
  // ----------------------------------------------------------------
  console.log('\n🔹 5. Kiểm thử Gợi ý kết nối (Recommendations) & Tóm tắt nội dung:');

  const recs = await aiService.getRecommendations(MOCK_FAMILY_ID, 'mem_8');
  assert(recs.recommendedMembers.length > 0, 'Tạo danh sách gợi ý thành viên thành công');
  assert(recs.upcomingEvents.length > 0, 'Tạo danh sách gợi ý sự kiện sắp tới thành công');
  assert(recs.featuredHeritage.length > 0, 'Tạo danh sách tài liệu di sản nổi bật thành công');

  const textToSummarize =
    'Cụ Nguyễn Văn Cụ là nhà giáo lão thành mẫu mực của dòng họ. Suốt đời cụ tận tụy với sự nghiệp trồng người và giáo dục con cháu. Cụ luôn răn dạy các thế hệ sau phải giữ gìn đạo đức, chăm lo học hành và cống hiến cho xã hội.';
  const summaryResult = aiService.summarizeText(textToSummarize);
  assert(summaryResult.summary.length > 0, 'Tóm tắt nội dung văn bản thành công');
  assert(summaryResult.keyPoints.length > 0, 'Trích xuất các ý chính (Key Points) thành công');

  // ----------------------------------------------------------------
  // TỔNG KẾT BÁO CÁO KIỂM THỬ
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ AI SERVICE:`);
  console.log(`   - Tổng số ca kiểm thử: ${totalTests}`);
  console.log(`   - Thành công (PASS)  : ${passedTests}`);
  console.log(`   - Thất bại (FAIL)    : ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAITests().catch((err) => {
  console.error('Lỗi nghiêm trọng khi chạy test:', err);
  process.exit(1);
});
