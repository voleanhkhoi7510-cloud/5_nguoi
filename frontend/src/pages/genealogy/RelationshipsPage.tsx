import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { btnDanger, btnPrimary, btnSecondary, inputClass } from '../../components/ui/styles'
import { useGenealogy } from './GenealogyContext'
import { describeRelation } from './rules'
import RelationFormModal from './RelationFormModal'
import type { Relation } from './genealogyData'

type ModalState = { mode: 'new' } | { mode: 'edit'; relation: Relation } | null
type Filter = 'all' | 'parent' | 'spouse'

export default function RelationshipsPage() {
  const { persons, relations, addRelation, updateRelation, deleteRelation } = useGenealogy()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState<ModalState>(null)
  const [deleting, setDeleting] = useState<{ relation: Relation; text: string } | null>(null)

  const byId = useMemo(() => new Map(persons.map((p) => [p.id, p])), [persons])
  const q = query.trim().toLowerCase()
  const rows = relations
    .map((relation) => ({ relation, text: describeRelation(relation, byId) }))
    .filter((row) => (filter === 'all' || row.relation.type === filter) && row.text.toLowerCase().includes(q))

  function handleSave(data: Omit<Relation, 'id'>) {
    if (modal?.mode === 'edit') updateRelation(modal.relation.id, data)
    else addRelation(data)
    setModal(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Quan hệ gia đình</h1>
        <button onClick={() => setModal({ mode: 'new' })} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus size={16} />
          Thêm quan hệ
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Tìm quan hệ theo tên</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên"
            className={`${inputClass} pl-9`}
          />
        </label>
        <label>
          <span className="sr-only">Lọc theo loại quan hệ</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className={inputClass}>
            <option value="all">Tất cả quan hệ</option>
            <option value="parent">Cha mẹ và con</option>
            <option value="spouse">Vợ chồng</option>
          </select>
        </label>
        <span className="text-sm text-slate-500">
          {rows.length} trên {relations.length} quan hệ
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {relations.length === 0 ? (
          <p className="p-10 text-center text-slate-500">Chưa có quan hệ nào. Bấm “Thêm quan hệ” để bắt đầu.</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-slate-500">Không có quan hệ nào khớp bộ lọc.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Quan hệ</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Loại</th>
                  <th className="px-5 py-2.5"><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ relation, text }) => (
                  <tr key={relation.id}>
                    <td className="px-5 py-3 text-slate-900">{text}</td>
                    <td className="hidden whitespace-nowrap px-3 py-3 text-slate-500 sm:table-cell">
                      {relation.type === 'parent' ? 'Cha mẹ và con' : 'Vợ chồng'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setModal({ mode: 'edit', relation })}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`Sửa quan hệ: ${text}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleting({ relation, text })}
                          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Xóa quan hệ: ${text}`}
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
      </div>

      {modal && (
        <RelationFormModal
          initial={modal.mode === 'edit' ? modal.relation : undefined}
          persons={persons}
          relations={relations}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleting && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleting(null)}>
          <p className="text-sm text-slate-600">
            Xóa quan hệ “{deleting.text}”? Cây gia phả sẽ cập nhật theo.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className={btnSecondary}>Hủy</button>
            <button
              onClick={() => {
                deleteRelation(deleting.relation.id)
                setDeleting(null)
              }}
              className={btnDanger}
            >
              Xóa
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
