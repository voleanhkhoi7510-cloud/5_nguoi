import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../../components/ui/Modal'
import Field from '../../components/ui/Field'
import { inputClass, btnPrimary, btnSecondary } from '../../components/ui/styles'
import type { Member } from './familyData'

interface Props {
  initial?: Member
  onSave: (data: Omit<Member, 'id'>) => void
  onClose: () => void
}

interface Errors {
  name?: string
  birthYear?: string
  deathYear?: string
}

const thisYear = new Date().getFullYear()

export default function MemberFormModal({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [gender, setGender] = useState<Member['gender']>(initial?.gender ?? 'Nam')
  const [birthYear, setBirthYear] = useState(initial ? String(initial.birthYear) : '')
  const [deathYear, setDeathYear] = useState(initial?.deathYear ? String(initial.deathYear) : '')
  const [job, setJob] = useState(initial?.job ?? '')
  const [city, setCity] = useState(initial?.city ?? '')
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    const by = Number(birthYear)
    if (!name.trim()) next.name = 'Vui lòng nhập họ và tên.'
    if (!birthYear.trim()) next.birthYear = 'Vui lòng nhập năm sinh.'
    else if (!Number.isInteger(by) || by < 1800 || by > thisYear) next.birthYear = `Năm sinh cần từ 1800 đến ${thisYear}.`
    if (deathYear.trim()) {
      const dy = Number(deathYear)
      if (!Number.isInteger(dy) || dy < by || dy > thisYear) next.deathYear = 'Năm mất cần từ năm sinh đến năm nay.'
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return

    onSave({
      name: name.trim(),
      gender,
      birthYear: by,
      deathYear: deathYear.trim() ? Number(deathYear) : undefined,
      job: job.trim(),
      city: city.trim(),
    })
  }

  return (
    <Modal title={initial ? 'Sửa thành viên' : 'Thêm thành viên'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Họ và tên" htmlFor="member-name" error={errors.name}>
          <input
            id="member-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby="member-name-error"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Giới tính" htmlFor="member-gender">
            <select
              id="member-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as Member['gender'])}
              className={inputClass}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </Field>
          <Field label="Năm sinh" htmlFor="member-birth" error={errors.birthYear}>
            <input
              id="member-birth"
              inputMode="numeric"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              aria-invalid={!!errors.birthYear}
              aria-describedby="member-birth-error"
              placeholder="1990"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Năm mất (nếu có)" htmlFor="member-death" error={errors.deathYear}>
          <input
            id="member-death"
            inputMode="numeric"
            value={deathYear}
            onChange={(e) => setDeathYear(e.target.value)}
            aria-invalid={!!errors.deathYear}
            aria-describedby="member-death-error"
            className={inputClass}
          />
        </Field>

        <Field label="Nghề nghiệp" htmlFor="member-job">
          <input id="member-job" value={job} onChange={(e) => setJob(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Nơi ở" htmlFor="member-city">
          <input id="member-city" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>Hủy</button>
          <button type="submit" className={btnPrimary}>{initial ? 'Lưu thay đổi' : 'Thêm thành viên'}</button>
        </div>
      </form>
    </Modal>
  )
}
