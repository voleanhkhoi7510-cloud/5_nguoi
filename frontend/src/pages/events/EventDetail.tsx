import { useState } from 'react'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { btnSecondary } from '../../components/ui/styles'
import { CURRENT_USER_ID, countRsvp, formatDate, invitees, rsvpLabels } from './eventsData'
import type { EventItem, Rsvp } from './eventsData'

interface Props {
  event: EventItem
  past: boolean
  onRsvp: (status: Rsvp) => void
  onEdit: () => void
  onDelete: () => void
}

const choices: { value: Rsvp; label: string }[] = [
  { value: 'yes', label: 'Tôi sẽ tham dự' },
  { value: 'maybe', label: 'Có thể' },
  { value: 'no', label: 'Không tham dự' },
]
const tabs: Rsvp[] = ['yes', 'maybe', 'no', 'pending']

export default function EventDetail({ event, past, onRsvp, onEdit, onDelete }: Props) {
  const [tab, setTab] = useState<Rsvp>('yes')
  const counts = countRsvp(event)
  const mine = event.rsvp[CURRENT_USER_ID] ?? 'pending'
  const people = invitees
    .filter((p) => (event.rsvp[p.id] ?? 'pending') === tab)
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-5">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">{event.title}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CalendarDays size={16} className="shrink-0 text-slate-400" />
              {formatDate(event.date)}
            </li>
            {event.time && (
              <li className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-slate-400" />
                {event.time}
              </li>
            )}
            <li className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-slate-400" />
              {event.place}
            </li>
          </ul>
          {event.description && <p className="mt-3 text-sm leading-relaxed text-slate-700">{event.description}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className={btnSecondary}>Sửa</button>
          <button onClick={onDelete} className={btnSecondary}>Xóa</button>
        </div>
      </div>

      <div className="border-b border-slate-200 p-5">
        <h3 className="text-sm font-medium text-slate-900">Bạn có tham dự không?</h3>
        {past ? (
          <p className="mt-2 text-sm text-slate-500">
            Sự kiện đã diễn ra nên không đăng ký thêm được. Câu trả lời của bạn: {rsvpLabels[mine]}.
          </p>
        ) : (
          <>
            <div role="group" aria-label="Đăng ký tham gia" className="mt-3 flex flex-wrap gap-2">
              {choices.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onRsvp(c.value)}
                  aria-pressed={mine === c.value}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    mine === c.value
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {mine === 'pending' && <p className="mt-2 text-sm text-slate-500">Bạn chưa trả lời.</p>}
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-sm font-medium text-slate-900">Người tham dự</h3>
        <div role="group" aria-label="Lọc theo trạng thái" className="mt-3 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`rounded-full px-3 py-1 text-sm ${
                tab === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {rsvpLabels[t]} {counts[t]}
            </button>
          ))}
        </div>

        {people.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Chưa có ai ở mục này.</p>
        ) : (
          <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm text-slate-900 sm:grid-cols-2">
            {people.map((p) => (
              <li key={p.id}>
                {p.name}
                {p.id === CURRENT_USER_ID && <span className="ml-2 text-slate-500">(Bạn)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
