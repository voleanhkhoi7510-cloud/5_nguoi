import { useState } from 'react'
import { Plus } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { btnDanger, btnPrimary, btnSecondary } from '../../components/ui/styles'
import { CURRENT_USER_ID, allPending, countRsvp, formatDate, initialEvents, todayIso } from './eventsData'
import type { EventItem, Rsvp } from './eventsData'
import EventDetail from './EventDetail'
import EventFormModal from './EventFormModal'
import type { EventFormData } from './EventFormModal'

type Tab = 'upcoming' | 'past'
type FormState = { mode: 'new' } | { mode: 'edit'; event: EventItem } | null

const newId = () => `e${Math.random().toString(36).slice(2, 9)}`

export default function EventsPage() {
  // Dữ liệu chỉ nằm trong bộ nhớ, tải lại trang sẽ về dữ liệu mẫu
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [tab, setTab] = useState<Tab>('upcoming')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(null)
  const [deleting, setDeleting] = useState<EventItem | null>(null)

  const today = todayIso()
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
  const visible = tab === 'upcoming' ? upcoming : past
  const selected = visible.find((e) => e.id === selectedId) ?? visible[0]

  function saveEvent(data: EventFormData) {
    if (form?.mode === 'edit') {
      const id = form.event.id
      setEvents((es) => es.map((e) => (e.id === id ? { ...e, ...data } : e)))
    } else {
      const created: EventItem = { id: newId(), ...data, rsvp: allPending() }
      setEvents((es) => [...es, created])
      setTab('upcoming')
      setSelectedId(created.id)
    }
    setForm(null)
  }

  function setRsvp(id: string, status: Rsvp) {
    setEvents((es) => es.map((e) => (e.id === id ? { ...e, rsvp: { ...e.rsvp, [CURRENT_USER_ID]: status } } : e)))
  }

  function deleteEvent(id: string) {
    setEvents((es) => es.filter((e) => e.id !== id))
    setDeleting(null)
  }

  const tabClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Sự kiện</h1>
        <button onClick={() => setForm({ mode: 'new' })} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus size={16} />
          Tạo sự kiện
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div>
          <div role="group" aria-label="Lọc sự kiện" className="flex gap-1">
            <button onClick={() => setTab('upcoming')} aria-pressed={tab === 'upcoming'} className={tabClass(tab === 'upcoming')}>
              Sắp tới ({upcoming.length})
            </button>
            <button onClick={() => setTab('past')} aria-pressed={tab === 'past'} className={tabClass(tab === 'past')}>
              Đã diễn ra ({past.length})
            </button>
          </div>

          {visible.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              {tab === 'upcoming' ? 'Chưa có sự kiện sắp tới. Bấm “Tạo sự kiện” để tạo.' : 'Chưa có sự kiện nào đã diễn ra.'}
            </p>
          ) : (
            <ul className="mt-3 space-y-1">
              {visible.map((e) => {
                const active = e.id === selected?.id
                return (
                  <li key={e.id}>
                    <button
                      onClick={() => setSelectedId(e.id)}
                      aria-current={active}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm ${
                        active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-medium">{e.title}</span>
                      <span className={`block ${active ? 'text-slate-300' : 'text-slate-500'}`}>{formatDate(e.date)}</span>
                      <span className={`block ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                        {countRsvp(e).yes} người tham dự
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {selected ? (
          <EventDetail
            key={selected.id}
            event={selected}
            past={selected.date < today}
            onRsvp={(status) => setRsvp(selected.id, status)}
            onEdit={() => setForm({ mode: 'edit', event: selected })}
            onDelete={() => setDeleting(selected)}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            Chọn một sự kiện để xem chi tiết.
          </p>
        )}
      </div>

      {form && (
        <EventFormModal
          initial={form.mode === 'edit' ? form.event : undefined}
          onSave={saveEvent}
          onClose={() => setForm(null)}
        />
      )}

      {deleting && (
        <Modal title="Xác nhận xóa" onClose={() => setDeleting(null)}>
          <p className="text-sm text-slate-600">Xóa sự kiện “{deleting.title}” cùng danh sách đăng ký tham gia?</p>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className={btnSecondary}>Hủy</button>
            <button onClick={() => deleteEvent(deleting.id)} className={btnDanger}>Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
