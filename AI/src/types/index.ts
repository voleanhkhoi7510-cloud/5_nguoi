// ==================== CÁC KIỂU DỮ LIỆU CỐT LÕI CỦA AI SERVICE ====================

export type Gender = 'male' | 'female' | 'other';

export interface FamilyMemberNode {
  memberId: string;
  familyId: string;
  branchId?: string | null | undefined;
  userId?: string | null | undefined;
  fullName: string;
  gender: Gender;
  generation: number;
  birthDate?: string | null | undefined;
  deathDate?: string | null | undefined;
  occupation?: string | null | undefined;
  education?: string | null | undefined;
  biography?: string | null | undefined;
  branchName?: string | null | undefined;
}

export interface ParentChildEdge {
  relationshipId: string;
  parentId: string;
  childId: string;
  relationshipType: 'father' | 'mother' | 'parent';
}

export interface MarriageEdge {
  marriageId: string;
  partner1Id: string;
  partner2Id: string;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  status: 'MARRIED' | 'DIVORCED' | 'WIDOWED';
}

export interface FamilyHeritageDoc {
  documentId: string;
  familyId: string;
  memberId?: string | null | undefined;
  title: string;
  documentType: 'GENEALOGY_BOOK' | 'FAMILY_RULE' | 'HISTORICAL_RECORD' | 'DECREE' | 'OTHER';
  fileUrl?: string | null | undefined;
  description?: string | null | undefined;
  createdAt?: string | undefined;
}

export interface EventAttendee {
  userId: string;
  fullName: string;
  status: 'GOING' | 'DECLINED' | 'TENTATIVE';
  updatedAt?: string | undefined;
}

export interface FamilyEventData {
  eventId: string;
  familyId: string;
  creatorId: string;
  title: string;
  description?: string | null | undefined;
  eventDate: string;
  location?: string | null | undefined;
  attendees?: EventAttendee[] | undefined;
}

export interface FamilyPostData {
  postId: string;
  familyId: string;
  authorId: string;
  authorName?: string | undefined;
  content: string;
  isAnnouncement: boolean;
  createdAt?: string | undefined;
}

export interface GenealogyTreeData {
  familyId: string;
  familyName: string;
  nodes: FamilyMemberNode[];
  parentChildEdges: ParentChildEdge[];
  marriageEdges: MarriageEdge[];
}

// Kết quả phân tích quan hệ xưng hô
export interface RelationshipAnalysis {
  fromMember: FamilyMemberNode;
  toMember: FamilyMemberNode;
  path: string[];
  generationDiff: number; // toMember.generation - fromMember.generation
  relationTitle: string; // "Ông Nội", "Bác", "Cháu gái", "Anh họ", v.v.
  detailedExplanation: string;
  pathDescription: string[];
}

// Định dạng truy vấn và kết quả Q&A
export type QAIntent =
  | 'RELATIONSHIP_QUERY'
  | 'MEMBER_LOOKUP'
  | 'HERITAGE_RULES'
  | 'EVENT_INFO'
  | 'STATISTICS_SUMMARY'
  | 'GENERAL_FAMILY_CHAT';

export interface QARequest {
  familyId: string;
  prompt: string;
  conversationId?: string | undefined;
  userId?: string | undefined;
  currentMemberId?: string | undefined;
}

export interface QASource {
  type: 'MEMBER' | 'DOCUMENT' | 'EVENT' | 'RELATIONSHIP' | 'POST';
  id: string;
  title: string;
  snippet?: string | undefined;
}

export interface QAResponse {
  conversationId: string;
  prompt: string;
  answer: string;
  intent: QAIntent;
  confidence: number;
  sources: QASource[];
  suggestedFollowUps?: string[] | undefined;
  generatedAt: string;
}

// Gợi ý kết nối thông minh
export interface RecommendationResult {
  recommendedMembers: Array<{
    memberId: string;
    fullName: string;
    generation: number;
    occupation?: string | null | undefined;
    reason: string;
    matchScore: number;
  }>;
  upcomingEvents: Array<{
    eventId: string;
    title: string;
    eventDate: string;
    location?: string | null | undefined;
    importance: string;
  }>;
  featuredHeritage: Array<{
    documentId: string;
    title: string;
    type: string;
    recommendationReason: string;
  }>;
}
