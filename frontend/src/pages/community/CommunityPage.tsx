import { useState } from 'react'
import { 
  Heart, MessageCircle, Share2, Image, Send, Bell, 
  MoreHorizontal, Sparkles, Filter, CheckCircle2, Bookmark
} from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  time: string
  avatarColor: string
}

interface Post {
  id: number
  author: string
  role: string
  avatarLetter: string
  avatarColor: string
  timeAgo: string
  content: string
  category: 'Kỷ niệm' | 'Thông báo' | 'Họp mặt' | 'Gia đình'
  likes: number
  isLiked: boolean
  isSaved?: boolean
  comments: Comment[]
  imageUrl?: string
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'Mẹ Yêu (Lê Thị Mai)',
    role: 'Chi 1 - Trưởng nữ',
    avatarLetter: 'M',
    avatarColor: 'bg-amber-500',
    timeAgo: '2 giờ trước',
    category: 'Họp mặt',
    content: 'Cuối tuần này cả nhà mình tập trung đông đủ làm bữa lẩu thái nhé các con! Ai về sớm phụ mẹ đi chợ nào 🍲✨',
    likes: 5,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        author: 'Lê Văn Minh',
        content: 'Con về sớm phụ mẹ xách đồ với nhặt rau nha!',
        time: '1 giờ trước',
        avatarColor: 'bg-indigo-600',
      },
      {
        id: 'c2',
        author: 'Lê Thị Thảo',
        content: 'Thèm quá mẹ ơi, tiếc là con đang ở Melbourne không về được 😭 Mẹ gửi ảnh vào nhóm nhé!',
        time: '30 phút trước',
        avatarColor: 'bg-emerald-600',
      },
    ],
  },
  {
    id: 2,
    author: 'Lê Văn Hùng',
    role: 'Trưởng ban Liên lạc Gia tộc',
    avatarLetter: 'H',
    avatarColor: 'bg-blue-600',
    timeAgo: 'Hôm qua',
    category: 'Thông báo',
    content: 'Kính báo cả dòng họ: Ngày 20 tháng 11 âm lịch tới đây là ngày giỗ cụ Lê Văn Thành tại nhà thờ tổ Hà Tĩnh. Ban liên lạc kính mời các gia đình thu xếp về dâng hương và họp họ cuối năm.',
    likes: 12,
    isLiked: true,
    comments: [
      {
        id: 'c3',
        author: 'Lê Văn Đức',
        content: 'Gia đình con trong Sài Gòn đã đặt vé máy bay ra rồi thưa bác.',
        time: 'Hôm qua',
        avatarColor: 'bg-purple-600',
      },
    ],
  },
  {
    id: 3,
    author: 'Lê Văn Minh',
    role: 'Kỹ sư phần mềm (Cháu nội)',
    avatarLetter: 'M',
    avatarColor: 'bg-indigo-600',
    timeAgo: '3 ngày trước',
    category: 'Kỷ niệm',
    content: 'Cây gia phả số của dòng họ mình đã được cập nhật thêm thế hệ F4 các cháu Bảo và Châu. Mọi người vào kiểm tra xem thông tin ngày sinh và địa chỉ đã chuẩn xác chưa nhé!',
    likes: 8,
    isLiked: false,
    comments: [],
  },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newContent, setNewContent] = useState('')
  const [category, setCategory] = useState<'Kỷ niệm' | 'Thông báo' | 'Họp mặt' | 'Gia đình'>('Gia đình')
  const [activeFilter, setActiveFilter] = useState<string>('Tất cả')
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleLike = (id: number) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === id) {
          const nextLiked = !post.isLiked
          return {
            ...post,
            isLiked: nextLiked,
            likes: nextLiked ? post.likes + 1 : post.likes - 1,
          }
        }
        return post
      })
    )
  }

  const handleBookmark = (id: number) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === id) {
          const nextSaved = !post.isSaved
          showToast(nextSaved ? 'Đã lưu bài viết vào mục yêu thích!' : 'Đã bỏ lưu bài viết')
          return { ...post, isSaved: nextSaved }
        }
        return post
      })
    )
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim()) return

    const newPost: Post = {
      id: Date.now(),
      author: 'Lê Văn Minh',
      role: 'Thành viên đang đăng nhập',
      avatarLetter: 'M',
      avatarColor: 'bg-indigo-600',
      timeAgo: 'Vừa xong',
      category: category,
      content: newContent.trim(),
      likes: 0,
      isLiked: false,
      comments: [],
    }

    setPosts([newPost, ...posts])
    setNewContent('')
    showToast('Đã đăng bài viết thành công!')
  }

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: 'c_' + Math.random().toString(36).slice(2, 7),
            author: 'Lê Văn Minh',
            content: text,
            time: 'Vừa xong',
            avatarColor: 'bg-indigo-600',
          }
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      })
    )

    setCommentInputs({ ...commentInputs, [postId]: '' })
  }

  const handleShare = (postId: number) => {
    navigator.clipboard?.writeText(window.location.origin + `/cong-dong#post-${postId}`)
    showToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm!')
  }

  const filteredPosts = activeFilter === 'Tất cả' 
    ? posts 
    : posts.filter(p => p.category === activeFilter)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bảng tin & Cộng đồng gia tộc</h1>
          <p className="text-sm text-slate-500">Nơi các thành viên chia sẻ tin tức, câu chuyện và những khoảnh khắc ấm áp.</p>
        </div>
      </div>

      {/* Create New Post Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleCreatePost}>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white shadow-sm">
              M
            </div>
            <div className="flex-1">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Hôm nay gia đình mình có chuyện gì vui? Chia sẻ với mọi người nào..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Chủ đề:</span>
              {(['Gia đình', 'Họp mặt', 'Thông báo', 'Kỷ niệm'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    category === cat 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Tính năng chọn ảnh từ máy tính hoặc album đã sẵn sàng!')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                <Image size={15} className="text-emerald-500" />
                <span>Thêm ảnh</span>
              </button>
              <button
                type="submit"
                disabled={!newContent.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={14} />
                <span>Đăng bài</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter size={14} className="text-slate-400 shrink-0 ml-1" />
        {['Tất cả', 'Họp mặt', 'Thông báo', 'Kỷ niệm', 'Gia đình'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 font-medium transition ${
              activeFilter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 text-sm">
            Chưa có bài viết nào trong danh mục này. Hãy là người đầu tiên đăng bài!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              id={`post-${post.id}`}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm transition"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${post.avatarColor} font-bold text-white shadow-sm text-sm`}>
                    {post.avatarLetter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{post.author}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{post.role}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
                    {post.category}
                  </span>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 ${post.isSaved ? 'text-amber-500 fill-amber-500' : ''}`}
                    title="Lưu bài viết"
                  >
                    <Bookmark size={16} fill={post.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 py-2">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Reaction Bar */}
              <div className="mx-4 mt-2 border-t border-slate-100 py-2 flex items-center justify-between text-xs text-slate-500">
                <span>{post.likes} lượt thích</span>
                <span>{post.comments.length} bình luận</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-around border-t border-slate-100 px-2 py-1">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium transition ${
                    post.isLiked ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                  <span>Thích</span>
                </button>
                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <MessageCircle size={16} />
                  <span>Bình luận ({post.comments.length})</span>
                </button>
                <button
                  onClick={() => handleShare(post.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <Share2 size={16} />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* Comment Section */}
              {(activeCommentPostId === post.id || post.comments.length > 0) && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-4 rounded-b-2xl space-y-3">
                  {post.comments.map((cm) => (
                    <div key={cm.id} className="flex gap-2.5 items-start text-xs">
                      <div className={`h-7 w-7 rounded-full ${cm.avatarColor} text-white font-bold flex items-center justify-center shrink-0 text-[11px]`}>
                        {cm.author.split(' ').pop()?.[0]}
                      </div>
                      <div className="flex-1 rounded-xl bg-white p-2.5 shadow-xs border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{cm.author}</span>
                          <span className="text-[10px] text-slate-400">{cm.time}</span>
                        </div>
                        <p className="mt-1 text-slate-700 leading-normal">{cm.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <div className="flex gap-2 items-center pt-1">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      M
                    </div>
                    <input
                      type="text"
                      placeholder="Viết câu trả lời hoặc chúc mừng..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddComment(post.id)
                        }
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                      title="Gửi bình luận"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
