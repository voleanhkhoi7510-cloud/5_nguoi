import type { Person, Relation } from './genealogyData'

export const NODE_W = 168
export const NODE_H = 56
const SPOUSE_GAP = 28
const SIBLING_GAP = 32
const LEVEL_GAP = 84

export interface LayoutNode {
  person: Person
  x: number
  y: number
}

export interface TreeLayout {
  nodes: LayoutNode[]
  paths: string[]
  width: number
  height: number
}

// Một "đơn vị" là một người cùng vợ/chồng (nếu có) đứng cạnh nhau, con cái nằm bên dưới
interface Unit {
  people: Person[]
  children: Unit[]
  width: number
}

function add(map: Map<string, string[]>, key: string, value: string) {
  const list = map.get(key)
  if (!list) map.set(key, [value])
  else if (!list.includes(value)) list.push(value)
}

const unitWidth = (count: number) => count * NODE_W + (count - 1) * SPOUSE_GAP

export function buildLayout(persons: Person[], relations: Relation[]): TreeLayout {
  const byId = new Map(persons.map((p) => [p.id, p]))
  const parentsOf = new Map<string, string[]>()
  const childrenOf = new Map<string, string[]>()
  const spousesOf = new Map<string, string[]>()

  for (const r of relations) {
    if (!byId.has(r.fromId) || !byId.has(r.toId)) continue
    if (r.type === 'parent') {
      add(childrenOf, r.fromId, r.toId)
      add(parentsOf, r.toId, r.fromId)
    } else {
      add(spousesOf, r.fromId, r.toId)
      add(spousesOf, r.toId, r.fromId)
    }
  }

  const hasParents = (id: string) => (parentsOf.get(id)?.length ?? 0) > 0
  const placed = new Set<string>()

  function buildUnit(p: Person): Unit | null {
    if (placed.has(p.id)) return null
    placed.add(p.id)

    // Vợ/chồng không có cha mẹ trong dữ liệu thì đứng cạnh người này
    const people = [p]
    for (const sid of spousesOf.get(p.id) ?? []) {
      const s = byId.get(sid)
      if (s && !placed.has(sid) && !hasParents(sid)) {
        placed.add(sid)
        people.push(s)
      }
    }

    const kidIds = new Set<string>()
    for (const person of people) for (const cid of childrenOf.get(person.id) ?? []) kidIds.add(cid)

    const children: Unit[] = []
    const kids = [...kidIds].map((id) => byId.get(id)!).sort((a, b) => a.birthYear - b.birthYear)
    for (const kid of kids) {
      const u = buildUnit(kid)
      if (u) children.push(u)
    }

    const kidsW = children.reduce((sum, c) => sum + c.width, 0) + Math.max(0, children.length - 1) * SIBLING_GAP
    return { people, children, width: Math.max(unitWidth(people.length), kidsW) }
  }

  // Gốc cây: người không có cha mẹ và vợ/chồng cũng không có cha mẹ. Người còn sót được thêm vào cuối.
  const rootCandidates = persons
    .filter((p) => !hasParents(p.id) && !(spousesOf.get(p.id) ?? []).some((sid) => hasParents(sid)))
    .sort((a, b) => a.birthYear - b.birthYear)
  const roots: Unit[] = []
  for (const p of [...rootCandidates, ...persons]) {
    const u = buildUnit(p)
    if (u) roots.push(u)
  }

  const nodes: LayoutNode[] = []
  const paths: string[] = []
  let maxDepth = 0

  function place(u: Unit, left: number, depth: number) {
    maxDepth = Math.max(maxDepth, depth)
    const y = depth * (NODE_H + LEVEL_GAP)
    const x0 = left + (u.width - unitWidth(u.people.length)) / 2
    const xs = u.people.map((_, i) => x0 + i * (NODE_W + SPOUSE_GAP))

    u.people.forEach((person, i) => nodes.push({ person, x: xs[i], y }))
    for (let i = 1; i < xs.length; i++) paths.push(`M${xs[i - 1] + NODE_W} ${y + NODE_H / 2}H${xs[i]}`)
    if (u.children.length === 0) return

    const kidsW = u.children.reduce((s, c) => s + c.width, 0) + (u.children.length - 1) * SIBLING_GAP
    let cx = left + (u.width - kidsW) / 2
    const childY = y + NODE_H + LEVEL_GAP
    const anchors: number[] = []
    for (const child of u.children) {
      anchors.push(cx + (child.width - unitWidth(child.people.length)) / 2 + NODE_W / 2)
      place(child, cx, depth + 1)
      cx += child.width + SIBLING_GAP
    }

    // Đường nối từ cha mẹ xuống các con
    const startX = xs.length > 1 ? xs[0] + NODE_W + SPOUSE_GAP / 2 : xs[0] + NODE_W / 2
    const startY = xs.length > 1 ? y + NODE_H / 2 : y + NODE_H
    const busY = y + NODE_H + LEVEL_GAP / 2
    const minX = Math.min(startX, ...anchors)
    const maxX = Math.max(startX, ...anchors)
    paths.push(`M${startX} ${startY}V${busY}`)
    if (maxX > minX) paths.push(`M${minX} ${busY}H${maxX}`)
    for (const ax of anchors) paths.push(`M${ax} ${busY}V${childY}`)
  }

  let offset = 0
  for (const root of roots) {
    place(root, offset, 0)
    offset += root.width + SIBLING_GAP * 2
  }

  return {
    nodes,
    paths,
    width: Math.max(0, offset - SIBLING_GAP * 2),
    height: (maxDepth + 1) * NODE_H + maxDepth * LEVEL_GAP,
  }
}
