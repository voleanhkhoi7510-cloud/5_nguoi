import { useState } from 'react'
import { BookOpen, Landmark, Scroll, Award, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react'

export default function HeritagePage() {
  const [activeTab, setActiveTab] = useState<'history' | 'rules' | 'ancestor'>('rules')

  const giaHuan = [
    { no: 1, title: 'Hiếu kính cha mẹ', desc: 'Thờ phụng ông bà, cha mẹ chí hiếu; khi sống hết lòng phụng dưỡng, khi khuất bóng trọn đạo cúng tế trang nghiêm.' },
    { no: 2, title: 'Thuận hòa huynh đệ', desc: 'Anh em một nhà như thể tay chân, đùm bọc giúp đỡ nhau lúc khốn khó, không vì tiền của mà mất tình ruột thịt.' },
    { no: 3, title: 'Chăm lo học nghiệp', desc: 'Hậu duệ phải cần cù hiếu học, rèn đức luyện tài, mở mang tri thức để giúp ích cho bản thân, gia đình và quê hương.' },
    { no: 4, title: 'Giữ gìn thanh bạch', desc: 'Làm việc gì cũng ngay thẳng chính trực, giữ gìn danh dự dòng tộc, không làm điều trái pháp luật luân thường.' },
    { no: 5, title: 'Gắn kết họ tộc', desc: 'Thường xuyên thăm hỏi họ hàng gần xa, nhớ ngày giỗ tết về quê thắp hương tại nhà thờ tổ, không quên nguồn cội.' },
  ]

  const milestones = [
    { year: '1932', event: 'Cụ Lê Văn Thành sinh tại làng quê Đức Thọ, Hà Tĩnh, đặt nền móng chi tộc.' },
    { year: '1958', event: 'Các thế hệ con cháu bắt đầu học tập và lập nghiệp tại Hà Nội, Đà Nẵng và miền Nam.' },
    { year: '1995', event: 'Khởi công tôn tạo, mở rộng khuôn viên Nhà thờ tổ Lê Tộc tại quê hương Hà Tĩnh.' },
    { year: '2020', event: 'Hội đồng gia tộc thống nhất số hóa phả hệ và tổ chức quỹ khuyến học dòng họ.' },
    { year: '2026', event: 'Ra mắt nền tảng số hóa FamilyConnect kết nối trọn vẹn mọi thế hệ khắp năm châu.' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 p-6 text-white shadow-lg sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200">
            <Scroll size={14} />
            <span>Di sản & Giá trị ngàn đời</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Di sản truyền thống Dòng họ Lê
          </h1>
          <p className="mt-2 text-sm text-amber-100 sm:text-base leading-relaxed">
            "Cây có cội mới trổ cành xanh ngọn, nước có nguồn mới biển rộng sông sâu." Cội nguồn là điểm tựa vững chãi nhất cho mọi thế hệ cháu con.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition ${
            activeTab === 'rules'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={16} />
          <span>Gia huấn & Quy ước</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition ${
            activeTab === 'history'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={16} />
          <span>Biên niên sử gia tộc</span>
        </button>
        <button
          onClick={() => setActiveTab('ancestor')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition ${
            activeTab === 'ancestor'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Landmark size={16} />
          <span>Nhà thờ tổ & Lăng mộ</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6">
            <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
              <Award className="text-amber-700" size={20} />
              5 Điều Gia Huấn Cốt Lõi
            </h2>
            <p className="text-xs text-amber-800/80 mt-1">
              Được truyền dạy qua các thế hệ và khắc ghi trong biên bản gia phả để con cháu noi gương tu dưỡng.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {giaHuan.map((item) => (
                <div key={item.no} className="rounded-xl border border-amber-100 bg-white p-4 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                      0{item.no}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-9">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Các Mốc Lịch Sử Tiêu Biểu</h2>
          <p className="text-xs text-slate-500 mt-1">Hành trình hình thành, phát triển và lan tỏa của các thế hệ.</p>

          <div className="mt-6 relative border-l-2 border-indigo-200 pl-6 ml-3 space-y-8">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-white" />
                <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  Năm {m.year}
                </span>
                <p className="mt-1.5 text-sm text-slate-700 font-medium">
                  {m.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ancestor' && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
                <Landmark size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Từ Đường Lê Tộc</h3>
                <p className="text-xs text-slate-500">Nhà thờ tổ chính</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-slate-400 mt-0.5" />
                <span>Thôn Trung Hòa, Xã Lâm Trung Thủy, Huyện Đức Thọ, Tỉnh Hà Tĩnh</span>
              </div>
              <p><strong className="text-slate-800">Người trông nom:</strong> Bác Lê Văn Hùng & Gia đình chi 1</p>
              <p><strong className="text-slate-800">Lễ tế chính:</strong> Ngày 20 tháng 11 Âm lịch hàng năm (Giỗ cụ Tổ)</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Quỹ Khuyến Học & Tương Tế</h3>
                <p className="text-xs text-slate-500">Ủng hộ con cháu đỗ đạt và người khó khăn</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <p>Hàng năm trích quỹ khen thưởng các cháu học sinh giỏi, đỗ đại học và đạt giải quốc gia.</p>
              <p><strong className="text-slate-800">Trưởng ban thủ quỹ:</strong> Cô Trần Thị Hoa</p>
              <p><strong className="text-slate-800">Số dư hiện tại:</strong> 45.000.000 VNĐ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
