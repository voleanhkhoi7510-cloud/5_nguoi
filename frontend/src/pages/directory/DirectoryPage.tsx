import { useState } from 'react'
import { 
  Search, Phone, Mail, MapPin, Briefcase, Filter, 
  ExternalLink, UserCheck, HeartHandshake, Copy, Check
} from 'lucide-react'
import { initialPersons } from '../genealogy/genealogyData'
import type { Person } from '../genealogy/genealogyData'

interface ContactPerson extends Person {
  phone?: string
  email?: string
  generation: number
  branch: string
}

const enrichedContacts: ContactPerson[] = initialPersons.map((p) => {
  let gen = 3
  if (['m01', 'm02'].includes(p.id)) gen = 1
  else if (['m03', 'm04', 'm05', 'm06', 'm07', 'm08'].includes(p.id)) gen = 2
  else if (['m15', 'm16'].includes(p.id)) gen = 4

  // Sample phone & email for living adults
  const isLiving = !p.deathYear
  const isAdult = p.birthYear < 2010

  const phone = (isLiving && isAdult) 
    ? `09${Math.floor(10000000 + Math.random() * 90000000)}` 
    : undefined
  const email = (isLiving && isAdult) 
    ? `${p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '')}@gmail.com` 
    : undefined

  let branch = 'Chi 1 (Trưởng)'
  if (['m04', 'm07', 'm11'].includes(p.id)) branch = 'Chi 2 (Đà Nẵng)'
  else if (['m05', 'm08', 'm12', 'm13'].includes(p.id)) branch = 'Chi 3 (Sài Gòn)'

  return {
    ...p,
    generation: gen,
    phone,
    email,
    branch,
  }
})

export default function DirectoryPage() {
  const [query, setQuery] = useState('')
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyPhone = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const cities = Array.from(new Set(enrichedContacts.map(p => p.city).filter(Boolean))) as string[]

  const filtered = enrichedContacts.filter(p => {
    const q = query.trim().toLowerCase()
    const matchQuery = !q || 
      p.name.toLowerCase().includes(q) || 
      p.city?.toLowerCase().includes(q) || 
      p.job?.toLowerCase().includes(q) ||
      p.phone?.includes(q)

    const matchGen = selectedGen === 'all' || p.generation === selectedGen
    const matchCity = selectedCity === 'all' || p.city === selectedCity

    return matchQuery && matchGen && matchCity
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh bạ thành viên dòng tộc</h1>
          <p className="text-sm text-slate-500">Tra cứu số điện thoại, nơi ở và thông tin liên lạc của các thành viên trong họ.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
          <HeartHandshake size={16} />
          <span>{enrichedContacts.filter(c => !c.deathYear).length} thành viên còn sống</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên thành viên, nghề nghiệp, nơi ở, số điện thoại..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              aria-label="Lọc theo thế hệ"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả thế hệ</option>
              <option value="1">Thế hệ 1 (Tiền bối)</option>
              <option value="2">Thế hệ 2 (Bác, chú, cô)</option>
              <option value="3">Thế hệ 3 (Anh, chị, em)</option>
              <option value="4">Thế hệ 4 (Hậu duệ)</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Lọc theo khu vực"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả khu vực</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const isDeceased = Boolean(p.deathYear)
          return (
            <div
              key={p.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                isDeceased ? 'border-slate-200 bg-slate-50/70 opacity-80' : 'border-slate-200 bg-white hover:border-indigo-200'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm ${
                      isDeceased ? 'bg-slate-400' : p.gender === 'Nam' ? 'bg-indigo-600' : 'bg-rose-500'
                    }`}>
                      {p.name.split(' ').pop()?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{p.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Đời thứ {p.generation}</span>
                        <span>•</span>
                        <span>{p.gender}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isDeceased ? 'bg-slate-200 text-slate-700' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {isDeceased ? 'Đã mất' : `${p.birthYear} (${new Date().getFullYear() - p.birthYear}t)`}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.city || 'Chưa cập nhật nơi ở'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.job || 'Chưa cập nhật nghề nghiệp'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.branch}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                {isDeceased ? (
                  <p className="text-[11px] italic text-slate-400 text-center py-1">
                    Hưởng thọ: {p.deathYear! - p.birthYear} tuổi ({p.birthYear} – {p.deathYear})
                  </p>
                ) : p.phone ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${p.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                      <Phone size={13} />
                      <span>{p.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyPhone(p.id, p.phone!)}
                      title="Sao chép số điện thoại"
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition"
                    >
                      {copiedId === p.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 text-center py-1">
                    Chưa cập nhật số điện thoại
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
