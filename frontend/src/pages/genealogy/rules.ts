import type { Person, Relation } from './genealogyData'

const thisYear = new Date().getFullYear()

export function describeRelation(r: Relation, byId: Map<string, Person>): string {
  const a = byId.get(r.fromId)
  const b = byId.get(r.toId)
  if (!a || !b) return 'Quan hệ không hợp lệ'
  if (r.type === 'parent') return `${a.name} là ${a.gender === 'Nam' ? 'cha' : 'mẹ'} của ${b.name}`
  return `${a.name} và ${b.name} là vợ chồng${r.year ? ` (kết hôn năm ${r.year})` : ''}`
}

function descendantsOf(id: string, relations: Relation[]): Set<string> {
  const seen = new Set<string>()
  const stack = [id]
  while (stack.length > 0) {
    const cur = stack.pop()!
    for (const r of relations) {
      if (r.type === 'parent' && r.fromId === cur && !seen.has(r.toId)) {
        seen.add(r.toId)
        stack.push(r.toId)
      }
    }
  }
  return seen
}

// Trả về câu báo lỗi (tiếng Việt) nếu quan hệ không hợp lệ, hợp lệ thì trả null
export function validateRelation(
  draft: Omit<Relation, 'id'>,
  relations: Relation[],
  persons: Person[],
  editingId?: string,
): string | null {
  const byId = new Map(persons.map((p) => [p.id, p]))
  const a = byId.get(draft.fromId)
  const b = byId.get(draft.toId)
  if (!a || !b) return 'Vui lòng chọn đủ hai người.'
  if (a.id === b.id) return 'Hai người trong một quan hệ phải là hai người khác nhau.'
  const others = relations.filter((r) => r.id !== editingId)

  if (draft.type === 'spouse') {
    const exists = others.some(
      (r) => r.type === 'spouse' && ((r.fromId === a.id && r.toId === b.id) || (r.fromId === b.id && r.toId === a.id)),
    )
    if (exists) return `${a.name} và ${b.name} đã là vợ chồng trong hệ thống.`
    if (draft.year !== undefined) {
      if (draft.year < Math.max(a.birthYear, b.birthYear)) return 'Năm kết hôn không thể trước năm sinh của một trong hai người.'
      if (draft.year > thisYear) return `Năm kết hôn không thể sau năm ${thisYear}.`
    }
    return null
  }

  // a là cha hoặc mẹ của b
  if (others.some((r) => r.type === 'parent' && r.fromId === a.id && r.toId === b.id)) {
    return `${a.name} đã là cha hoặc mẹ của ${b.name} trong hệ thống.`
  }
  if (descendantsOf(b.id, others).has(a.id)) {
    return `${a.name} là con cháu của ${b.name}, nên không thể là cha hoặc mẹ của ${b.name}.`
  }
  if (a.birthYear >= b.birthYear) {
    return `${a.name} sinh năm ${a.birthYear}, không thể là cha hoặc mẹ của ${b.name} sinh năm ${b.birthYear}.`
  }
  if (others.filter((r) => r.type === 'parent' && r.toId === b.id).length >= 2) {
    return `${b.name} đã có đủ cha và mẹ. Hãy xóa hoặc sửa quan hệ cũ trước.`
  }
  return null
}

export interface FamilyOf {
  parents: Person[]
  spouses: Person[]
  children: Person[]
  siblings: Person[]
}

export function getFamilyOf(id: string, persons: Person[], relations: Relation[]): FamilyOf {
  const byId = new Map(persons.map((p) => [p.id, p]))
  const pick = (ids: string[]) => ids.map((i) => byId.get(i)).filter((p): p is Person => !!p)
  const byAge = (a: Person, b: Person) => a.birthYear - b.birthYear

  const parentIds = relations.filter((r) => r.type === 'parent' && r.toId === id).map((r) => r.fromId)
  const childIds = relations.filter((r) => r.type === 'parent' && r.fromId === id).map((r) => r.toId)
  const spouseIds = relations
    .filter((r) => r.type === 'spouse' && (r.fromId === id || r.toId === id))
    .map((r) => (r.fromId === id ? r.toId : r.fromId))
  const siblingIds = new Set(
    relations.filter((r) => r.type === 'parent' && parentIds.includes(r.fromId) && r.toId !== id).map((r) => r.toId),
  )

  return {
    parents: pick(parentIds),
    spouses: pick(spouseIds),
    children: pick(childIds).sort(byAge),
    siblings: pick([...siblingIds]).sort(byAge),
  }
}
