import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Network, Calendar, Images, MessageSquare, Plus, ArrowRight,
  Heart, MessageCircle, Clock, MapPin, Sparkles, BookOpen, ChevronRight
} from 'lucide-react'
import { initialPersons } from '../genealogy/genealogyData'
import { initialEvents } from '../events/eventsData'
import { samplePhotos } from '../photos/photoData'
import type { Photo } from '../photos/photoData'

export default function DashboardPage() {
  const [likeCount, setLikeCount] = useState(12)
  const [hasLiked, setHasLiked] = useState(false)

  const upcomingEvents = initialEvents.slice(0, 3)
  const recentPhotos = samplePhotos.slice(0, 4)
  const totalGenerations = 4
  const totalMembers = initialPersons.length

  const handleLike = () => {
    setHasLiked(!hasLiked)
    setLikeCount(prev => hasLiked ? prev - 1 : prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-300" />
            <span>Không gian số kết nối các thế hệ</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Chào mừng bạn đến với FamilyConnect!
          </h1>
          <p className="mt-2 text-sm text-indigo-100 sm:text-base leading-relaxed">
            Nền tảng lưu giữ phả hệ gia tộc, chia sẻ khoảnh khắc kỷ niệm, cập nhật tin tức và thắt chặt tình cảm giữa các thế hệ trong dòng họ.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/gia-pha"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-950 shadow-sm transition hover:bg-indigo-50"
            >
              <Network size={16} className="text-indigo-600" />
              Xem Cây Gia Phả
            </Link>
            <Link
              to="/cong-dong"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700/60 border border-indigo-400/30 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <MessageSquare size={16} />
              Đăng tin gia đình
            </Link>
          </div>
        </div>
        {/* Subtle decorative circle */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 -bottom-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
      </div>

      {/* Key Metric Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Link
          to="/gia-pha"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Thành viên gia tộc</span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{totalMembers}</div>
          <p className="mt-1 text-xs text-slate-500">Trải dài qua {totalGenerations} thế hệ</p>
        </Link>

        <Link
          to="/gia-pha"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Thế hệ kế thừa</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
              <Network size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{totalGenerations}</div>
          <p className="mt-1 text-xs text-slate-500">Từ năm 1932 đến nay</p>
        </Link>

        <Link
          to="/su-kien"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sự kiện sắp tới</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{upcomingEvents.length}</div>
          <p className="mt-1 text-xs text-slate-500">Lễ cúng giỗ & họp mặt</p>
        </Link>

        <Link
          to="/anh"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kho ảnh kỷ niệm</span>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
              <Images size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{samplePhotos.length}</div>
          <p className="mt-1 text-xs text-slate-500">Hình ảnh & video lưu giữ</p>
        </Link>
      </div>

      {/* Main Grid: Left = Feed & Events, Right = Photos & Quick Directory */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols wide) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Actions Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Lối tắt tác vụ</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Link
                to="/cong-dong"
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Plus size={16} className="text-indigo-600" />
                <span>Viết bài mới</span>
              </Link>
              <Link
                to="/su-kien"
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
              >
                <Calendar size={16} className="text-amber-600" />
                <span>Thêm sự kiện</span>
              </Link>
              <Link
                to="/anh"
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                <Images size={16} className="text-purple-600" />
                <span>Tải ảnh lên</span>
              </Link>
              <Link
                to="/tro-ly-ai"
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Sparkles size={16} className="text-emerald-600" />
                <span>Hỏi trợ lý AI</span>
              </Link>
            </div>
          </div>

          {/* Featured Community Post */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-slate-900">Bảng tin gia đình mới nhất</h2>
              </div>
              <Link to="/cong-dong" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Xem tất cả bài viết <ChevronRight size={14} />
              </Link>
            </div>

            <article className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    M
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">Mẹ Yêu (Lê Thị Mai)</h3>
                    <p className="text-xs text-slate-400">2 giờ trước • Chế độ Gia đình</p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  Họp mặt
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                Cuối tuần này cả nhà mình tập trung đông đủ làm bữa tiệc ấm cúng nhé các con! Ai về sớm phụ mẹ đi chợ mua đồ nào 🍲✨
              </p>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
                <span>{likeCount} lượt thích</span>
                <span>4 bình luận</span>
              </div>

              <div className="mt-2 flex items-center gap-2 pt-2">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition ${
                    hasLiked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
                  <span>Thích</span>
                </button>
                <Link
                  to="/cong-dong"
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                >
                  <MessageCircle size={16} />
                  <span>Bình luận</span>
                </Link>
              </div>
            </article>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-amber-600" />
                <h2 className="font-semibold text-slate-900">Sự kiện & Ngày giỗ sắp tới</h2>
              </div>
              <Link to="/su-kien" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Tất cả sự kiện <ChevronRight size={14} />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 p-3.5 transition hover:border-slate-200 hover:bg-slate-50 gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                      <span className="text-[10px] font-semibold uppercase leading-none">Tháng 11</span>
                      <span className="text-base font-bold leading-none mt-0.5">{evt.date.split('-')[2] || '20'}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 text-sm">{evt.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {evt.time && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} /> {evt.time}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {evt.place}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/su-kien"
                    className="self-end sm:self-center inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Chi tiết <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Photos & Quick Directory */}
        <div className="space-y-6">
          {/* Photo Gallery Preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Images size={18} className="text-purple-600" />
                <h2 className="font-semibold text-slate-900">Kho ảnh gia đình</h2>
              </div>
              <Link to="/anh" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Xem thêm
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {recentPhotos.map((photo: Photo) => (
                <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-1.5 left-2 right-2 truncate text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {photo.name}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/anh"
              className="mt-4 block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              + Đăng ảnh kỷ niệm mới
            </Link>
          </div>

          {/* Quick Heritage & Gia huấn card */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <BookOpen size={18} className="text-amber-700" />
              <h2 className="font-semibold">Gia huấn truyền thống</h2>
            </div>
            <blockquote className="mt-3 text-xs italic text-amber-950/80 border-l-2 border-amber-400 pl-3 leading-relaxed">
              "Kính trên nhường dưới, thuận hòa anh em. Uống nước nhớ nguồn, rạng danh dòng tộc."
            </blockquote>
            <p className="mt-2 text-[11px] text-amber-800/80">
              Truyền thống gìn giữ từ các bậc tiền nhân chi nhánh Lê Tộc.
            </p>
            <Link
              to="/di-san"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-950"
            >
              Tìm hiểu truyền thống & gia quy <ArrowRight size={13} />
            </Link>
          </div>

          {/* Quick Contact / Danh bạ preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-700" />
                <h2 className="font-semibold text-slate-900">Đại diện chi họ</h2>
              </div>
              <Link to="/danh-ba" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Danh bạ
              </Link>
            </div>

            <div className="mt-3 space-y-2.5">
              {initialPersons.slice(2, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {p.name.split(' ').pop()?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.city || 'Việt Nam'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600">
                    {p.job || 'Thành viên'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
