import { useState } from 'react'
import { Sparkles, Send, Bot, User, HelpCircle, BookOpen, Clock, Heart } from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  time: string
}

const suggestedPrompts = [
  'Cách xưng hô với con của bác ruột theo thứ bậc?',
  'Mâm cúng giỗ truyền thống người Việt cần chuẩn bị những lễ vật gì?',
  'Gợi ý lời chúc mừng thọ 80 tuổi ý nghĩa và trang trọng',
  'Quy tắc ghi chép năm sinh, năm mất và phả hệ theo phong tục?',
]

const aiKnowledgeBase: Record<string, string> = {
  'xưng hô': `Theo phong tục truyền thống Việt Nam:
1. Con của bác ruột (dù ít tuổi hơn bạn) thì bạn vẫn phải gọi là "Anh/Chị họ" và xưng "Em", vì vai vế của cha mẹ (bác là anh của bố/mẹ bạn).
2. Tương tự, nếu bạn là con của bác, còn người kia là con của chú/cô thì bạn là "Anh/Chị", người kia gọi bạn bằng "Anh/Chị" và xưng "Em".
3. Người xưa có câu: "Bé bằng củ khoai, cắn đôi làm bảy; hễ là con bác thì phải gọi bằng anh."`,

  'cúng giỗ': `Mâm cỗ cúng giỗ truyền thống (đặc biệt theo truyền thống miền Trung / miền Bắc) thường gồm:
1. Hương, hoa tươi (cúc vàng, hoa huệ), trầu cau, chén rượu trắng, chén trà sạch và đèn nến.
2. Mâm ngũ quả tươi ngon, tròn đầy biểu trưng cho sự viên mãn.
3. Mâm cỗ mặn: Xôi gấc/xôi vò, gà luộc nguyên con ngậm hoa hồng, nem rán, bát canh bóng/canh măng miến, giò lụa, thịt luộc hoặc kho tàu.
4. Vàng mã, sớ cúng cầu nguyện tiền nhân phù hộ độ trì cho con cháu bình an, mạnh khỏe.`,

  'chúc thọ': `Lời chúc thọ 80 tuổi trang trọng dành cho ông bà:
"Kính chúc Ông/Bà đại thọ 80 tuổi Phúc Như Đông Hải - Thọ Tỷ Nam Sơn! Chúng con cháu nguyện cầu hồng ân tổ tiên che chở cho Ông/Bà luôn dồi dào sức khỏe, an khang trường thọ, tâm hồn thư thái an vui bên con cháu sum vầy."`,

  'gia phả': `Ý nghĩa của việc số hóa Cây Gia Phả trên FamilyConnect:
- Giúp các thế hệ cháu con (nhất là thế hệ trẻ sinh ra và lập nghiệp xa quê hương) luôn biết rõ gốc rễ, họ hàng của mình.
- Tránh tình trạng nhầm lẫn vai vế xưng hô hay thất lạc thông tin sau nhiều năm.
- Lưu giữ hình ảnh, ngày giỗ, kỷ niệm của các bậc tiền nhân mãi mãi với thời gian.`,
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Xin chào anh Lê Văn Minh! Tôi là Trợ lý AI Gia đình FamilyConnect. Tôi có thể hỗ trợ anh tra cứu cách xưng hô theo phả hệ, gợi ý phong tục cúng lễ, lời chúc và thông tin dòng tộc. Anh cần tôi giúp gì hôm nay?',
      time: 'Vừa xong',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query) return

    const userMsg: Message = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
      time: 'Vừa xong',
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let reply = 'Cảm ơn câu hỏi của anh. Trong phong tục tập quán gia đình Việt Nam, sự tôn kính tiền nhân và kính trên nhường dưới luôn là nền tảng cốt lõi. Tôi đã lưu lại câu hỏi này để tiếp tục cập nhật và hỗ trợ phả hệ gia đình mình tốt hơn.'

      const qLower = query.toLowerCase()
      if (qLower.includes('xưng hô') || qLower.includes('bác') || qLower.includes('chú') || qLower.includes('gọi')) {
        reply = aiKnowledgeBase['xưng hô']
      } else if (qLower.includes('giỗ') || qLower.includes('cúng') || qLower.includes('mâm')) {
        reply = aiKnowledgeBase['cúng giỗ']
      } else if (qLower.includes('chúc') || qLower.includes('thọ') || qLower.includes('mừng')) {
        reply = aiKnowledgeBase['chúc thọ']
      } else if (qLower.includes('gia phả') || qLower.includes('phả hệ') || qLower.includes('ý nghĩa')) {
        reply = aiKnowledgeBase['gia phả']
      }

      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: reply,
        time: 'Vừa xong',
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 700)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trợ lý AI Văn hóa & Phả hệ Gia đình</h1>
          <p className="text-xs text-slate-500">Tư vấn phong tục, cách xưng hô, văn khấn và gắn kết họ tộc 24/7.</p>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gợi ý câu hỏi phổ biến:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              💡 {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-slate-400 italic">
              <Bot size={16} className="text-indigo-500 animate-pulse" />
              <span>Trợ lý AI đang tra cứu gia phả và soạn câu trả lời...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-slate-100 p-3 sm:p-4 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi về xưng hô, lễ nghi, phả hệ hoặc thông tin gia đình..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send size={15} />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
