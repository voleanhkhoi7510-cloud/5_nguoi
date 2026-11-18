import { useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { btnPrimary, btnSecondary, btnDanger, inputClass } from '../../components/ui/styles'
import { initialFamilies } from './familyData'
import type { Family, Member } from './familyData'
import FamilyFormModal from './FamilyFormModal'
import MemberFormModal from './MemberFormModal'

type FamilyModalState = { mode: 'new' } | { mode: 'edit'; family: Family } | null
type MemberModalState = { mode: 'new' } | { mode: 'edit'; member: Member } | null
interface ConfirmState {
  message: string
  onConfirm: () => void
}

const newId = () => Math.random().toString(36).slice(2, 9)

export default function FamilyPage() {
  // Dữ liệu chỉ nằm trong bộ nhớ, tải lại trang sẽ về dữ liệu mẫu
  const [families, setFamilies] = useState<Family[]>(initialFamilies)
  const [selectedId, setSelectedId] = useState(initialFamilies[0].id)
  const [query, setQuery] = useState('')
  const [familyModal, setFamilyModal] = useState<FamilyModalState>(null)
  const [memberModal, setMemberModal] = useState<MemberModalState>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const current = families.find((f) => f.id === selectedId) ?? families[0]
  const q = query.trim().toLowerCase()
  const members = current ? current.members.filter((m) => m.name.toLowerCase().includes(q)) : []

  function saveFamily(data: { name: string; address: string }) {
    if (familyModal?.mode === 'edit') {
      const id = familyModal.family.id
      setFamilies((fs) => fs.map((f) => (f.id === id ? { ...f, ...data } : f)))
    } else {
      const created: Family = { id: newId(), ...data, members: [] }
      setFamilies((fs) => [...fs, created])
      setSelectedId(created.id)
      setQuery('')
    }
    setFamilyModal(null)
  }

  function deleteFamily(id: string) {
    const rest = families.filter((f) => f.id !== id)
    setFamilies(rest)
    setSelectedId(rest[0]?.id ?? '')
    setConfirm(null)
  }

  function saveMember(data: Omit<Member, 'id'>) {
    if (!current) return
    const editingId = memberModal?.mode === 'edit' ? memberModal.member.id : null
    setFamilies((fs) =>
      fs.map((f) =>
        f.id !== current.id
          ? f
          : {
              ...f,
              members: editingId
                ? f.members.map((m) => (m.id === editingId ? { ...m, ...data } : m))
                : [...f.members, { id: newId(), ...data }],
            },
      ),
    )
    setMemberModal(null)
  }

  function deleteMember(id: string) {
    if (!current) return
    setFamilies((fs) =>
      fs.map((f) => (f.id === current.id ? { ...f, members: f.members.filter((m) => m.id !== id) } : f)),
    )
    setConfirm(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Gia đình và thành viên</h1>
        <button onClick={() => setFamilyModal({ mode: 'new' })} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus size={16} />
          Thêm gia đình
        </button>
      </div>

      {families.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Chưa có gia đình nào. Bấm “Thêm gia đình” để bắt đầu.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
          {/* Danh sách gia đình */}
          <nav aria-label="Danh sách gia đình" className="space-y-1">
            {families.map((f) => (
              <button
                key={f.id}
                onClick={() => { setSelectedId(f.id); setQuery('') }}
                aria-current={f.id === current?.id}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm ${
                  f.id === current?.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block font-medium">{f.name}</span>
                <span className={`block ${f.id === current?.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {f.members.length} thành viên
                </span>
              </button>
            ))}
          </nav>

          {/* Thành viên của gia đình đang chọn */}
          {current && (
            <section className="min-w-0 rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{current.name}</h2>
                  <p className="text-sm text-slate-500">{current.address || 'Chưa có nơi ở'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setFamilyModal({ mode: 'edit', family: current })} className={btnSecondary}>
                    Sửa
                  </button>
                  <button
                    onClick={() =>
                      setConfirm({
                        message: `Xóa “${current.name}” và ${current.members.length} thành viên trong gia đình này?`,
                        onConfirm: () => deleteFamily(current.id),
                      })
                    }
                    className={btnSecondary}
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 p-5 pb-3">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Tìm thành viên</span>
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm theo tên"
                    className={`${inputClass} pl-9`}
                  />
                </label>
                <button onClick={() => setMemberModal({ mode: 'new' })} className={`${btnPrimary} flex items-center gap-2`}>
                  <Plus size={16} />
                  Thêm thành viên
                </button>
              </div>

              {current.members.length === 0 ? (
                <p className="p-10 text-center text-slate-500">Gia đình này chưa có thành viên. Bấm “Thêm thành viên” để thêm người đầu tiên.</p>
              ) : members.length === 0 ? (
                <p className="p-10 text-center text-slate-500">Không có thành viên nào tên “{query.trim()}”.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-5 py-2.5 font-medium">Họ và tên</th>
                        <th className="px-3 py-2.5 font-medium">Giới tính</th>
                        <th className="px-3 py-2.5 font-medium">Năm sinh</th>
                        <th className="hidden px-3 py-2.5 font-medium md:table-cell">Nghề nghiệp</th>
                        <th className="hidden px-3 py-2.5 font-medium md:table-cell">Nơi ở</th>
                        <th className="px-5 py-2.5"><span className="sr-only">Thao tác</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((m) => (
                        <tr key={m.id}>
                          <td className="px-5 py-3 font-medium text-slate-900">{m.name}</td>
                          <td className="px-3 py-3">{m.gender}</td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {m.birthYear}
                            {m.deathYear ? ` – ${m.deathYear} (đã mất)` : ''}
                          </td>
                          <td className="hidden px-3 py-3 md:table-cell">{m.job || '—'}</td>
                          <td className="hidden px-3 py-3 md:table-cell">{m.city || '—'}</td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => setMemberModal({ mode: 'edit', member: m })}
                                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                aria-label={`Sửa ${m.name}`}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  setConfirm({
                                    message: `Xóa ${m.name} khỏi “${current.name}”?`,
                                    onConfirm: () => deleteMember(m.id),
                                  })
                                }
                                className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                aria-label={`Xóa ${m.name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {familyModal && (
        <FamilyFormModal
          initial={familyModal.mode === 'edit' ? familyModal.family : undefined}
          onSave={saveFamily}
          onClose={() => setFamilyModal(null)}
        />
      )}
      {memberModal && (
        <MemberFormModal
          initial={memberModal.mode === 'edit' ? memberModal.member : undefined}
          onSave={saveMember}
          onClose={() => setMemberModal(null)}
        />
      )}
      {confirm && (
        <Modal title="Xác nhận xóa" onClose={() => setConfirm(null)}>
          <p className="text-sm text-slate-600">{confirm.message}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setConfirm(null)} className={btnSecondary}>Hủy</button>
            <button onClick={confirm.onConfirm} className={btnDanger}>Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
