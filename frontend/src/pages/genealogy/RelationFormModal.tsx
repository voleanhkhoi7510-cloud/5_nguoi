import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../../components/ui/Modal'
import Field from '../../components/ui/Field'
import { btnPrimary, btnSecondary, inputClass } from '../../components/ui/styles'
import type { Person, Relation, RelationType } from './genealogyData'
import { describeRelation, validateRelation } from './rules'

interface Props {
  initial?: Relation
  persons: Person[]
  relations: Relation[]
  onSave: (data: Omit<Relation, 'id'>) => void
  onClose: () => void
}

interface SelectProps {
  id: string
  value: string
  onChange: (value: string) => void
  people: Person[]
}

function PersonSelect({ id, value, onChange, people }: SelectProps) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">Chọn người</option>
      {people.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} (sinh {p.birthYear})
        </option>
      ))}
    </select>
  )
}

export default function RelationFormModal({ initial, persons, relations, onSave, onClose }: Props) {
  const [type, setType] = useState<RelationType>(initial?.type ?? 'parent')
  const [fromId, setFromId] = useState(initial?.fromId ?? '')
  const [toId, setToId] = useState(initial?.toId ?? '')
  const [year, setYear] = useState(initial?.year ? String(initial.year) : '')
  const [error, setError] = useState('')

  const byId = useMemo(() => new Map(persons.map((p) => [p.id, p])), [persons])
  const sorted = useMemo(() => [...persons].sort((a, b) => a.name.localeCompare(b.name, 'vi')), [persons])
  const isParent = type === 'parent'

  // Xóa thông báo lỗi cũ khi người dùng đổi lựa chọn
  useEffect(() => {
    setError('')
  }, [type, fromId, toId, year])

  const yearNum = !isParent && year.trim() ? Number(year) : undefined
  const preview =
    fromId && toId && fromId !== toId
      ? describeRelation({ id: '', type, fromId, toId, year: Number.isInteger(yearNum) ? yearNum : undefined }, byId)
      : ''

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (yearNum !== undefined && !Number.isInteger(yearNum)) {
      setError('Năm kết hôn phải là số, ví dụ 1990.')
      return
    }
    const draft = { type, fromId, toId, year: yearNum }
    const message = validateRelation(draft, relations, persons, initial?.id)
    if (message) {
      setError(message)
      return
    }
    onSave(draft)
  }

  return (
    <Modal title={initial ? 'Sửa quan hệ' : 'Thêm quan hệ'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Loại quan hệ" htmlFor="rel-type">
          <select
            id="rel-type"
            value={type}
            onChange={(e) => setType(e.target.value as RelationType)}
            className={inputClass}
          >
            <option value="parent">Cha hoặc mẹ và con</option>
            <option value="spouse">Vợ chồng</option>
          </select>
        </Field>

        <Field label={isParent ? 'Cha hoặc mẹ' : 'Người thứ nhất'} htmlFor="rel-from">
          <PersonSelect id="rel-from" value={fromId} onChange={setFromId} people={sorted} />
        </Field>

        <Field label={isParent ? 'Con' : 'Người thứ hai'} htmlFor="rel-to">
          <PersonSelect id="rel-to" value={toId} onChange={setToId} people={sorted} />
        </Field>

        {!isParent && (
          <Field label="Năm kết hôn (không bắt buộc)" htmlFor="rel-year">
            <input
              id="rel-year"
              inputMode="numeric"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="1990"
              className={inputClass}
            />
          </Field>
        )}

        {preview && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{preview}</p>}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Hủy
          </button>
          <button type="submit" className={btnPrimary}>
            {initial ? 'Lưu thay đổi' : 'Thêm quan hệ'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
