import type {
  FamilyMemberNode,
  ParentChildEdge,
  MarriageEdge,
  FamilyHeritageDoc,
  FamilyEventData,
  FamilyPostData,
  GenealogyTreeData,
} from './types/index.js';
import {
  MOCK_FAMILY_ID,
  MOCK_FAMILY_NAME,
  MOCK_MEMBERS,
  MOCK_PARENT_CHILD,
  MOCK_MARRIAGES,
  MOCK_HERITAGE_DOCS,
  MOCK_EVENTS,
  MOCK_POSTS,
} from './mockData.js';

export interface DataConnectorOptions {
  prismaClient?: any;
  preferDatabase?: boolean;
}

export class FamilyDataConnector {
  private prisma: any | null = null;
  private preferDatabase: boolean = false;

  // In-memory store cho phép test và thêm dữ liệu động
  private customMembers: Map<string, FamilyMemberNode[]> = new Map();
  private customParentChild: Map<string, ParentChildEdge[]> = new Map();
  private customMarriages: Map<string, MarriageEdge[]> = new Map();
  private customHeritage: Map<string, FamilyHeritageDoc[]> = new Map();
  private customEvents: Map<string, FamilyEventData[]> = new Map();
  private customPosts: Map<string, FamilyPostData[]> = new Map();

  constructor(options?: DataConnectorOptions) {
    this.prisma = options?.prismaClient || null;
    this.preferDatabase = options?.preferDatabase ?? false;

    // Nạp dữ liệu mock mặc định cho familyId = '1'
    this.customMembers.set(MOCK_FAMILY_ID, [...MOCK_MEMBERS]);
    this.customParentChild.set(MOCK_FAMILY_ID, [...MOCK_PARENT_CHILD]);
    this.customMarriages.set(MOCK_FAMILY_ID, [...MOCK_MARRIAGES]);
    this.customHeritage.set(MOCK_FAMILY_ID, [...MOCK_HERITAGE_DOCS]);
    this.customEvents.set(MOCK_FAMILY_ID, [...MOCK_EVENTS]);
    this.customPosts.set(MOCK_FAMILY_ID, [...MOCK_POSTS]);
  }

  /** Thiết lập Prisma client */
  public setPrismaClient(client: any): void {
    this.prisma = client;
    this.preferDatabase = true;
  }

  /** Lấy toàn bộ cây gia phả của gia đình */
  public async getGenealogyTree(familyId: string): Promise<GenealogyTreeData> {
    const cleanId = String(familyId).replace(/^fam_/, '');

    if (this.preferDatabase && this.prisma) {
      try {
        const family = await this.prisma.families.findUnique({
          where: { family_id: BigInt(cleanId) },
        });

        if (family) {
          const dbMembers = await this.prisma.members.findMany({
            where: { family_id: BigInt(cleanId) },
            include: { member_profiles: true, family_branches: true },
          });

          const nodes: FamilyMemberNode[] = dbMembers.map((m: any) => ({
            memberId: `mem_${m.member_id}`,
            familyId: cleanId,
            branchId: m.branch_id ? `branch_${m.branch_id}` : null,
            userId: m.user_id ? m.user_id.toString() : null,
            fullName: m.full_name,
            gender: m.gender?.toLowerCase() || 'other',
            generation: m.generation,
            birthDate: m.birth_date ? new Date(m.birth_date).toISOString().split('T')[0] : null,
            deathDate: m.death_date ? new Date(m.death_date).toISOString().split('T')[0] : null,
            occupation: m.member_profiles?.occupation || null,
            education: m.member_profiles?.education || null,
            biography: m.member_profiles?.biography || null,
            branchName: m.family_branches?.name || null,
          }));

          const dbPC = await this.prisma.parent_child_relationships.findMany({
            where: {
              members_parent_child_relationships_parent_idTomembers: { family_id: BigInt(cleanId) },
            },
          });

          const parentChildEdges: ParentChildEdge[] = dbPC.map((rel: any) => ({
            relationshipId: `pc_${rel.relationship_id}`,
            parentId: `mem_${rel.parent_id}`,
            childId: `mem_${rel.child_id}`,
            relationshipType: (rel.relationship_type || 'parent') as any,
          }));

          const dbMarriages = await this.prisma.marriages.findMany({
            where: {
              members_marriages_partner1_idTomembers: { family_id: BigInt(cleanId) },
            },
          });

          const marriageEdges: MarriageEdge[] = dbMarriages.map((m: any) => ({
            marriageId: `m_${m.marriage_id}`,
            partner1Id: `mem_${m.partner1_id}`,
            partner2Id: `mem_${m.partner2_id}`,
            startDate: m.start_date ? new Date(m.start_date).toISOString().split('T')[0] : null,
            status: m.status || 'MARRIED',
          }));

          if (nodes.length > 0) {
            return {
              familyId: cleanId,
              familyName: family.name,
              nodes,
              parentChildEdges,
              marriageEdges,
            };
          }
        }
      } catch (err) {
        // Fallback sang mock data trong môi trường test
      }
    }

    // Lấy từ in-memory store thử nghiệm
    const nodes = this.customMembers.get(cleanId) || this.customMembers.get(MOCK_FAMILY_ID) || [];
    const parentChildEdges = this.customParentChild.get(cleanId) || this.customParentChild.get(MOCK_FAMILY_ID) || [];
    const marriageEdges = this.customMarriages.get(cleanId) || this.customMarriages.get(MOCK_FAMILY_ID) || [];

    return {
      familyId: cleanId,
      familyName: cleanId === MOCK_FAMILY_ID ? MOCK_FAMILY_NAME : `Gia tộc #${cleanId}`,
      nodes,
      parentChildEdges,
      marriageEdges,
    };
  }

  /** Lấy danh sách tài liệu di sản gia tộc */
  public async getFamilyHeritage(familyId: string): Promise<FamilyHeritageDoc[]> {
    const cleanId = String(familyId).replace(/^fam_/, '');

    if (this.preferDatabase && this.prisma) {
      try {
        const docs = await this.prisma.family_documents.findMany({
          where: { family_id: BigInt(cleanId) },
        });
        if (docs.length > 0) {
          return docs.map((d: any) => ({
            documentId: `doc_${d.document_id}`,
            familyId: cleanId,
            memberId: d.member_id ? `mem_${d.member_id}` : null,
            title: d.title,
            documentType: d.document_type || 'OTHER',
            description: d.description || null,
            fileUrl: d.file_url || null,
            createdAt: d.created_at ? new Date(d.created_at).toISOString() : undefined,
          }));
        }
      } catch {}
    }

    return this.customHeritage.get(cleanId) || this.customHeritage.get(MOCK_FAMILY_ID) || [];
  }

  /** Lấy danh sách sự kiện gia tộc kèm RSVPs */
  public async getFamilyEvents(familyId: string): Promise<FamilyEventData[]> {
    const cleanId = String(familyId).replace(/^fam_/, '');

    if (this.preferDatabase && this.prisma) {
      try {
        const events = await this.prisma.events.findMany({
          where: { family_id: BigInt(cleanId) },
          include: {
            event_rsvps: {
              include: { users: { select: { user_id: true, full_name: true } } },
            },
          },
          orderBy: { event_date: 'asc' },
        });

        if (events.length > 0) {
          return events.map((e: any) => ({
            eventId: `event_${e.event_id}`,
            familyId: cleanId,
            creatorId: e.creator_id.toString(),
            title: e.title,
            description: e.description,
            eventDate: new Date(e.event_date).toISOString(),
            location: e.location,
            attendees: e.event_rsvps.map((r: any) => ({
              userId: r.user_id.toString(),
              fullName: r.users.full_name,
              status: r.status,
              updatedAt: new Date(r.updated_at).toISOString(),
            })),
          }));
        }
      } catch {}
    }

    return this.customEvents.get(cleanId) || this.customEvents.get(MOCK_FAMILY_ID) || [];
  }

  /** Lấy danh sách bài viết cộng đồng */
  public async getFamilyPosts(familyId: string): Promise<FamilyPostData[]> {
    const cleanId = String(familyId).replace(/^fam_/, '');

    if (this.preferDatabase && this.prisma) {
      try {
        const posts = await this.prisma.posts.findMany({
          where: { family_id: BigInt(cleanId) },
          include: { users: { select: { full_name: true } } },
          orderBy: { created_at: 'desc' },
        });

        if (posts.length > 0) {
          return posts.map((p: any) => ({
            postId: `post_${p.post_id}`,
            familyId: cleanId,
            authorId: p.author_id.toString(),
            authorName: p.users.full_name,
            content: p.content,
            isAnnouncement: p.is_announcement,
            createdAt: new Date(p.created_at).toISOString(),
          }));
        }
      } catch {}
    }

    return this.customPosts.get(cleanId) || this.customPosts.get(MOCK_FAMILY_ID) || [];
  }

  /** Chèn dữ liệu thử nghiệm động cho môi trường test */
  public setMockFamilyData(
    familyId: string,
    data: {
      members?: FamilyMemberNode[];
      parentChildEdges?: ParentChildEdge[];
      marriageEdges?: MarriageEdge[];
      heritageDocs?: FamilyHeritageDoc[];
      events?: FamilyEventData[];
      posts?: FamilyPostData[];
    }
  ): void {
    if (data.members) this.customMembers.set(familyId, data.members);
    if (data.parentChildEdges) this.customParentChild.set(familyId, data.parentChildEdges);
    if (data.marriageEdges) this.customMarriages.set(familyId, data.marriageEdges);
    if (data.heritageDocs) this.customHeritage.set(familyId, data.heritageDocs);
    if (data.events) this.customEvents.set(familyId, data.events);
    if (data.posts) this.customPosts.set(familyId, data.posts);
  }
}
