import { FamilyDataConnector, type DataConnectorOptions } from './dataConnector.js';
import { KnowledgeRetrievalEngine } from './knowledgeRetrieval.js';
import { RelationshipGraphEngine } from './relationshipGraph.js';
import { FamilyQAEngine } from './qaEngine.js';
import { RecommendationService } from './recommendationService.js';
import type {
  QARequest,
  QAResponse,
  RelationshipAnalysis,
  RecommendationResult,
  GenealogyTreeData,
} from './types/index.js';

export * from './types/index.js';
export * from './mockData.js';
export {
  FamilyDataConnector,
  KnowledgeRetrievalEngine,
  RelationshipGraphEngine,
  FamilyQAEngine,
  RecommendationService,
};

/**
 * FamilyAIService - Facade tập trung cung cấp toàn bộ năng lực AI cho nền tảng FamilyConnect:
 * 1. Phân tích đồ thị phả hệ & Xưng hô Việt Nam chuẩn mực
 * 2. Khung truy xuất dữ liệu & Tìm kiếm ngữ nghĩa
 * 3. Trợ lý AI Q&A nguyên mẫu dựa trên dữ liệu gia đình
 * 4. Động cơ gợi ý kết nối thành viên và di sản
 */
export class FamilyAIService {
  private connector: FamilyDataConnector;
  private retrieval: KnowledgeRetrievalEngine;
  private qaEngine: FamilyQAEngine;
  private recommendation: RecommendationService;

  constructor(options?: DataConnectorOptions) {
    this.connector = new FamilyDataConnector(options);
    this.retrieval = new KnowledgeRetrievalEngine(this.connector);
    this.qaEngine = new FamilyQAEngine(this.connector, this.retrieval);
    this.recommendation = new RecommendationService(this.connector);
  }

  /** Lấy connector để thiết lập database hoặc mock data */
  public getConnector(): FamilyDataConnector {
    return this.connector;
  }

  /** Phân tích mối quan hệ xưng hô giữa 2 thành viên */
  public async explainRelationship(
    familyId: string,
    fromMemberId: string,
    toMemberId: string
  ): Promise<RelationshipAnalysis | null> {
    const tree = await this.connector.getGenealogyTree(familyId);
    const graph = new RelationshipGraphEngine(
      tree.nodes,
      tree.parentChildEdges,
      tree.marriageEdges
    );
    const fromId = String(fromMemberId).startsWith('mem_') ? fromMemberId : `mem_${fromMemberId}`;
    const toId = String(toMemberId).startsWith('mem_') ? toMemberId : `mem_${toMemberId}`;
    return graph.analyzeRelationship(fromId, toId);
  }

  /** Trả lời câu hỏi gia đình qua AI Q&A Engine */
  public async askQuestion(request: QARequest): Promise<QAResponse> {
    return this.qaEngine.answerQuestion(request);
  }

  /** Tìm kiếm ngữ nghĩa đa thuộc tính */
  public async semanticSearch(familyId: string, query: string, topK: number = 5) {
    return this.retrieval.searchKnowledge(familyId, query, topK);
  }

  /** Lấy cây gia phả */
  public async getTree(familyId: string): Promise<GenealogyTreeData> {
    return this.connector.getGenealogyTree(familyId);
  }

  /** Lấy các gợi ý thông minh */
  public async getRecommendations(
    familyId: string,
    currentMemberId?: string | undefined
  ): Promise<RecommendationResult> {
    return this.recommendation.getRecommendations(familyId, currentMemberId);
  }

  /** Tóm tắt nội dung tài liệu, bài viết hoặc tiểu sử */
  public summarizeText(text: string): { summary: string; keyPoints: string[] } {
    if (!text || !text.trim()) {
      return { summary: '', keyPoints: [] };
    }
    const sentences = text
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 8);

    const keySentences = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 2)));
    const summary = keySentences.join(' ');
    const keyPoints = sentences.slice(0, 5).map((s) => s.replace(/^[•\-\*0-9.]\s*/, ''));

    return {
      summary: summary || text,
      keyPoints,
    };
  }
}

// Instance mặc định dùng sẵn
export const defaultAIService = new FamilyAIService();
