import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../../components/ui/Modal'
import Field from '../../components/ui/Field'
import { btnPrimary, btnSecondary, inputClass } from '../../components/ui/styles'
import { todayIso } from './eventsData'
import type { EventItem } from './eventsData'

export type EventFormData = Pick<EventItem, 'title' | 'date' | 'time' | 'place' | 'description'>

interface Props {
  initial?: EventItem
  onSave: (data: EventFormData) => void
  onClose: () => void
}

interface Errors {
  title?: string
  date?: string
  place?: string
}

export default function EventFormModal({ initial, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [date, setDate] = useState(initial?.date ?? '')
  const [time, setTime] = useState(initial?.time ?? '')
  const [place, setPlace] = useState(initial?.place ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!title.trim()) next.title = 'Vui lòng nhập tên sự kiện.'
    if (!date) next.date = 'Vui lòng chọn ngày tổ chức.'
    else if (!initial && date < todayIso()) next.date = 'Ngày tổ chức phải từ hôm nay trở đi.'
    if (!place.trim()) next.place = 'Vui lòng nhập địa điểm.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSave({ title: title.trim(), date, time, place: place.trim(), description: description.trim() })
  }

  return (
    <Modal title={initial ? 'Sửa sự kiện' : 'Tạo sự kiện'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Tên sự kiện" htmlFor="event-title" error={errors.title}>
          <input
            id="event-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby="event-title-error"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ngày" htmlFor="event-date" error={errors.date}>
            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={!!errors.date}
              aria-describedby="event-date-error"
              className={inputClass}
            />
          </Field>
          <Field label="Giờ" htmlFor="event-time">
            <input id="event-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
          </Field>
        </div>

        <Field label="Địa điểm" htmlFor="event-place" error={errors.place}>
          <input
            id="event-place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            aria-invalid={!!errors.place}
            aria-describedby="event-place-error"
            className={inputClass}
          />
        </Field>

        <Field label="Mô tả" htmlFor="event-desc">
          <textarea
            id="event-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>Hủy</button>
          <button type="submit" className={btnPrimary}>{initial ? 'Lưu thay đổi' : 'Tạo sự kiện'}</button>
        </div>
      </form>
    </Modal>
  )
}
