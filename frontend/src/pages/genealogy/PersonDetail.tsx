import type { Person, Relation } from './genealogyData'
import { lifeSpan } from './genealogyData'
import { getFamilyOf } from './rules'

interface Props {
  person: Person | null
  persons: Person[]
  relations: Relation[]
  onSelect: (id: string) => void
}

export default function PersonDetail({ person, persons, relations, onSelect }: Props) {
  if (!person) {
    return (
      <aside className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        Chọn một người trên cây để xem thông tin và quan hệ của người đó.
      </aside>
    )
  }

  const f = getFamilyOf(person.id, persons, relations)
  const rows = [
    { label: 'Cha', people: f.parents.filter((p) => p.gender === 'Nam') },
    { label: 'Mẹ', people: f.parents.filter((p) => p.gender === 'Nữ') },
    { label: 'Chồng', people: f.spouses.filter((p) => p.gender === 'Nam') },
    { label: 'Vợ', people: f.spouses.filter((p) => p.gender === 'Nữ') },
    { label: 'Con', people: f.children },
    { label: 'Anh chị em', people: f.siblings },
  ].filter((r) => r.people.length > 0)

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">{person.name}</h2>
      <p className="text-sm text-slate-500">
        {person.gender}, {lifeSpan(person)}
        {person.deathYear ? ' (đã mất)' : ''}
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        {person.job && (
          <div>
            <dt className="text-slate-500">Nghề nghiệp</dt>
            <dd className="mt-0.5 text-slate-900">{person.job}</dd>
          </div>
        )}
        {person.city && (
          <div>
            <dt className="text-slate-500">Nơi ở</dt>
            <dd className="mt-0.5 text-slate-900">{person.city}</dd>
          </div>
        )}
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-slate-500">{r.label}</dt>
            <dd className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
              {r.people.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
                >
                  {p.name}
                </button>
              ))}
            </dd>
          </div>
        ))}
        {rows.length === 0 && <p className="text-slate-500">Chưa có quan hệ nào được ghi nhận.</p>}
      </dl>

      <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
        Muốn thêm hoặc sửa quan hệ, vào mục Quan hệ trên menu.
      </p>
    </aside>
  )
}
