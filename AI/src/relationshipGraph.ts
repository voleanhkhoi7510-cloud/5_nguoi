import type {
  FamilyMemberNode,
  ParentChildEdge,
  MarriageEdge,
  RelationshipAnalysis,
} from './types/index.js';

export class RelationshipGraphEngine {
  private members: Map<string, FamilyMemberNode> = new Map();
  private childrenMap: Map<string, Set<string>> = new Map();
  private parentsMap: Map<string, Set<string>> = new Map();
  private spousesMap: Map<string, Set<string>> = new Map();
  private parentRelType: Map<string, 'father' | 'mother' | 'parent'> = new Map();

  constructor(
    members: FamilyMemberNode[],
    parentChildEdges: ParentChildEdge[],
    marriageEdges: MarriageEdge[]
  ) {
    this.initGraph(members, parentChildEdges, marriageEdges);
  }

  public initGraph(
    members: FamilyMemberNode[],
    parentChildEdges: ParentChildEdge[],
    marriageEdges: MarriageEdge[]
  ): void {
    this.members.clear();
    this.childrenMap.clear();
    this.parentsMap.clear();
    this.spousesMap.clear();
    this.parentRelType.clear();

    for (const m of members) {
      this.members.set(m.memberId, m);
      this.childrenMap.set(m.memberId, new Set());
      this.parentsMap.set(m.memberId, new Set());
      this.spousesMap.set(m.memberId, new Set());
    }

    for (const pc of parentChildEdges) {
      if (!this.childrenMap.has(pc.parentId)) this.childrenMap.set(pc.parentId, new Set());
      if (!this.parentsMap.has(pc.childId)) this.parentsMap.set(pc.childId, new Set());

      this.childrenMap.get(pc.parentId)!.add(pc.childId);
      this.parentsMap.get(pc.childId)!.add(pc.parentId);
      this.parentRelType.set(`${pc.parentId}->${pc.childId}`, pc.relationshipType);
    }

    for (const m of marriageEdges) {
      if (!this.spousesMap.has(m.partner1Id)) this.spousesMap.set(m.partner1Id, new Set());
      if (!this.spousesMap.has(m.partner2Id)) this.spousesMap.set(m.partner2Id, new Set());

      this.spousesMap.get(m.partner1Id)!.add(m.partner2Id);
      this.spousesMap.get(m.partner2Id)!.add(m.partner1Id);
    }
  }

  public getMember(id: string): FamilyMemberNode | undefined {
    return this.members.get(id);
  }

  public getAllMembers(): FamilyMemberNode[] {
    return Array.from(this.members.values());
  }

  public getParents(id: string): string[] {
    return Array.from(this.parentsMap.get(id) || []);
  }

  public getChildren(id: string): string[] {
    return Array.from(this.childrenMap.get(id) || []);
  }

  public getSpouses(id: string): string[] {
    return Array.from(this.spousesMap.get(id) || []);
  }

  /** Tìm đường đi ngắn nhất giữa 2 người qua quan hệ phả hệ (BFS) */
  public findShortestPath(fromId: string, toId: string): string[] {
    if (fromId === toId) return [fromId];
    if (!this.members.has(fromId) || !this.members.has(toId)) return [];

    const queue: string[][] = [[fromId]];
    const visited = new Set<string>([fromId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1]!;

      if (current === toId) return path;

      // Hàng xóm gồm: cha mẹ, con cái, vợ chồng
      const neighbors = new Set<string>([
        ...this.getParents(current),
        ...this.getChildren(current),
        ...this.getSpouses(current),
      ]);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return [];
  }

  /** Tìm Tổ tiên chung gần nhất (Lowest Common Ancestor - LCA) */
  public findLowestCommonAncestor(id1: string, id2: string): { lcaId: string | null; dist1: number; dist2: number } {
    const getAncestorsWithDist = (startId: string): Map<string, number> => {
      const map = new Map<string, number>();
      const queue: [string, number][] = [[startId, 0]];
      const visited = new Set<string>([startId]);

      while (queue.length > 0) {
        const [curr, dist] = queue.shift()!;
        map.set(curr, dist);

        for (const parent of this.getParents(curr)) {
          if (!visited.has(parent)) {
            visited.add(parent);
            queue.push([parent, dist + 1]);
          }
        }
      }
      return map;
    };

    const anc1 = getAncestorsWithDist(id1);
    const anc2 = getAncestorsWithDist(id2);

    let lcaId: string | null = null;
    let minDistSum = Infinity;
    let finalDist1 = -1;
    let finalDist2 = -1;

    for (const [anc, d1] of anc1.entries()) {
      if (anc2.has(anc)) {
        const d2 = anc2.get(anc)!;
        const sum = d1 + d2;
        if (sum < minDistSum) {
          minDistSum = sum;
          lcaId = anc;
          finalDist1 = d1;
          finalDist2 = d2;
        }
      }
    }

    return { lcaId, dist1: finalDist1, dist2: finalDist2 };
  }

  /** Phân tích mối quan hệ và cách xưng hô chuẩn mực theo văn hóa Việt Nam */
  public analyzeRelationship(fromId: string, toId: string): RelationshipAnalysis | null {
    const memberA = this.members.get(fromId);
    const memberB = this.members.get(toId);

    if (!memberA || !memberB) return null;

    const path = this.findShortestPath(fromId, toId);
    const pathDescription: string[] = path.map((id) => this.members.get(id)?.fullName || id);
    const genDiff = memberB.generation - memberA.generation;

    // 1. Bản thân
    if (fromId === toId) {
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: 0,
        relationTitle: 'Bản thân',
        detailedExplanation: `${memberA.fullName} là chính mình.`,
        pathDescription,
      };
    }

    // 2. Vợ - Chồng
    if (this.getSpouses(fromId).includes(toId)) {
      const title = memberB.gender === 'female' ? 'Vợ' : 'Chồng';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: 0,
        relationTitle: title,
        detailedExplanation: `${memberA.fullName} và ${memberB.fullName} là quan hệ vợ chồng gắn kết.`,
        pathDescription,
      };
    }

    // 3. Cha / Mẹ - Con
    const isChild = this.getChildren(fromId).includes(toId);
    const isParent = this.getParents(fromId).includes(toId);

    if (isParent) {
      const title = memberB.gender === 'female' ? 'Mẹ ruột' : 'Cha ruột';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: -1,
        relationTitle: title,
        detailedExplanation: `${memberB.fullName} là ${title.toLowerCase()} sinh dưỡng của ${memberA.fullName}.`,
        pathDescription,
      };
    }

    if (isChild) {
      const title = memberB.gender === 'female' ? 'Con gái' : 'Con trai';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: 1,
        relationTitle: title,
        detailedExplanation: `${memberB.fullName} là ${title.toLowerCase()} của ${memberA.fullName}.`,
        pathDescription,
      };
    }

    // 4. Ông / Bà - Cháu (genDiff = -2 hoặc 2)
    const parentsOfA = this.getParents(fromId);
    let isGrandParent = false;
    let isGrandMother = memberB.gender === 'female';
    let isMaternal = false; // Ngoại

    for (const pId of parentsOfA) {
      if (this.getParents(pId).includes(toId)) {
        isGrandParent = true;
        const parentNode = this.members.get(pId);
        if (parentNode?.gender === 'female') isMaternal = true;
        break;
      }
    }

    if (isGrandParent) {
      const title = isMaternal
        ? isGrandMother ? 'Bà Ngoại' : 'Ông Ngoại'
        : isGrandMother ? 'Bà Nội' : 'Ông Nội';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: -2,
        relationTitle: title,
        detailedExplanation: `${memberB.fullName} là ${title} của ${memberA.fullName} (thế hệ thứ ${memberB.generation} so với thế hệ thứ ${memberA.generation}).`,
        pathDescription,
      };
    }

    // Kiểm tra toMember có phải là cháu nội/ngoại của memberA
    const childrenOfA = this.getChildren(fromId);
    for (const cId of childrenOfA) {
      if (this.getChildren(cId).includes(toId)) {
        const childNode = this.members.get(cId);
        const isFromSon = childNode?.gender === 'male';
        const title = isFromSon
          ? memberB.gender === 'female' ? 'Cháu Gái Nội' : 'Cháu Trai Nội'
          : memberB.gender === 'female' ? 'Cháu Gái Ngoại' : 'Cháu Trai Ngoại';
        return {
          fromMember: memberA,
          toMember: memberB,
          path,
          generationDiff: 2,
          relationTitle: title,
          detailedExplanation: `${memberB.fullName} là ${title} của ${memberA.fullName}.`,
          pathDescription,
        };
      }
    }

    // 5. Cụ / Cố - Chắt (genDiff = -3 hoặc 3)
    if (genDiff === -3) {
      const title = memberB.gender === 'female' ? 'Cụ Bà' : 'Cụ Ông';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: -3,
        relationTitle: title,
        detailedExplanation: `${memberB.fullName} là ${title} (cố tổ 3 đời) của ${memberA.fullName}.`,
        pathDescription,
      };
    }
    if (genDiff === 3) {
      const title = memberB.gender === 'female' ? 'Chắt Gái' : 'Chắt Trai';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: 3,
        relationTitle: title,
        detailedExplanation: `${memberB.fullName} là ${title} trong dòng họ của ${memberA.fullName}.`,
        pathDescription,
      };
    }

    // 6. Anh / Chị / Em ruột hoặc anh chị em họ (Cùng thế hệ genDiff = 0)
    if (genDiff === 0) {
      const { lcaId, dist1, dist2 } = this.findLowestCommonAncestor(fromId, toId);

      // Cùng cha mẹ ruột (dist1 = 1 && dist2 = 1)
      if (dist1 === 1 && dist2 === 1) {
        const isOlder = (memberB.birthDate || '') < (memberA.birthDate || '');
        let title = '';
        if (isOlder) {
          title = memberB.gender === 'female' ? 'Chị gái ruột' : 'Anh trai ruột';
        } else {
          title = memberB.gender === 'female' ? 'Em gái ruột' : 'Em trai ruột';
        }
        return {
          fromMember: memberA,
          toMember: memberB,
          path,
          generationDiff: 0,
          relationTitle: title,
          detailedExplanation: `${memberA.fullName} và ${memberB.fullName} là anh em ruột thịt cùng dòng máu cha mẹ.`,
          pathDescription,
        };
      }

      // Anh chị em họ (Chung ông bà: dist1 = 2 && dist2 = 2)
      if (dist1 === 2 && dist2 === 2) {
        const isOlder = (memberB.birthDate || '') < (memberA.birthDate || '');
        const title = isOlder
          ? memberB.gender === 'female' ? 'Chị họ' : 'Anh họ'
          : memberB.gender === 'female' ? 'Em gái họ' : 'Em trai họ';
        return {
          fromMember: memberA,
          toMember: memberB,
          path,
          generationDiff: 0,
          relationTitle: title,
          detailedExplanation: `${memberA.fullName} và ${memberB.fullName} cùng thế hệ thứ ${memberA.generation}, là anh chị em đồng tộc chung cội nguồn ông bà.`,
          pathDescription,
        };
      }
    }

    // 7. Quan hệ Bác / Chú / Cô / Cậu / Dì (genDiff = -1 nhưng không phải cha mẹ ruột)
    if (genDiff === -1) {
      // Tìm xem toMember có phải là anh em ruột của cha mẹ memberA không
      for (const pId of parentsOfA) {
        const parentNode = this.members.get(pId);
        const { lcaId, dist1, dist2 } = this.findLowestCommonAncestor(pId, toId);

        if (dist1 === 1 && dist2 === 1) {
          // toMember là anh/chị/em ruột của cha mẹ
          const isOlderThanParent = (memberB.birthDate || '') < (parentNode?.birthDate || '');
          let title = '';

          if (parentNode?.gender === 'male') {
            // Bên nội
            if (memberB.gender === 'male') {
              title = isOlderThanParent ? 'Bác trai' : 'Chú';
            } else {
              title = isOlderThanParent ? 'Bác gái' : 'Cô';
            }
          } else {
            // Bên ngoại
            if (memberB.gender === 'male') {
              title = 'Cậu';
            } else {
              title = isOlderThanParent ? 'Bác gái' : 'Dì';
            }
          }

          return {
            fromMember: memberA,
            toMember: memberB,
            path,
            generationDiff: -1,
            relationTitle: title,
            detailedExplanation: `${memberB.fullName} là ${title} của ${memberA.fullName} (${memberB.fullName} là ${isOlderThanParent ? 'anh/chị' : 'em'} của phụ mẫu ${parentNode?.fullName}).`,
            pathDescription,
          };
        }
      }
    }

    // 8. Quan hệ Cháu (genDiff = 1 nhưng không phải con ruột)
    if (genDiff === 1) {
      const title = memberB.gender === 'female' ? 'Cháu gái' : 'Cháu trai';
      return {
        fromMember: memberA,
        toMember: memberB,
        path,
        generationDiff: 1,
        relationTitle: title,
        detailedExplanation: `${memberB.fullName} là ${title} trong dòng họ của ${memberA.fullName} (thế hệ thứ ${memberB.generation} gọi ${memberA.fullName} thế hệ thứ ${memberA.generation} là Bác/Chú/Cô/Dì).`,
        pathDescription,
      };
    }

    // Mặc định
    const defaultTitle =
      genDiff < 0
        ? `Bậc tiền bối (cách ${Math.abs(genDiff)} thế hệ)`
        : genDiff > 0
        ? `Hậu duệ đời sau (cách ${genDiff} thế hệ)`
        : 'Người cùng thế hệ dòng họ';

    return {
      fromMember: memberA,
      toMember: memberB,
      path,
      generationDiff: genDiff,
      relationTitle: defaultTitle,
      detailedExplanation: `${memberA.fullName} (đời ${memberA.generation}) và ${memberB.fullName} (đời ${memberB.generation}) là người cùng dòng tộc, quan hệ cách ${Math.abs(genDiff)} đời.`,
      pathDescription,
    };
  }
}
