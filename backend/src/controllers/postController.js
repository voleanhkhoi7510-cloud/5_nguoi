let mockPosts = [
  {
    id: 1,
    user_id: 1,
    author_name: "Trần Quang Huy",
    content: "Chào cả nhà, đây là bài viết đầu tiên trên gia phả kết nối!",
    image_url: null,
    likes: [1], 
    comments: [
      { id: 1, user_id: 2, author_name: "Thành viên 2", content: "Chào Huy nhé!", created_at: new Date() }
    ],
    created_at: new Date()
  }
];

const createPost = async (req, res) => {
  try {
    const { content, image_url } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Nội dung bài viết không được để trống!" });
    }

    const newPost = {
      id: mockPosts.length + 1,
      user_id: req.user?.id || 1,
      author_name: req.user?.email || "Thành viên gia đình",
      content,
      image_url: image_url || null,
      likes: [],
      comments: [],
      created_at: new Date()
    };

    mockPosts.unshift(newPost); 
    return res.status(201).json({ message: "Tạo bài viết thành công!", data: newPost });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Lấy danh sách bài viết thành công!",
      total: mockPosts.length,
      data: mockPosts
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = mockPosts.find(p => p.id == id);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết!" });
    }
    if (!content) {
      return res.status(400).json({ message: "Nội dung bình luận không được để trống!" });
    }

    const newComment = {
      id: post.comments.length + 1,
      user_id: req.user?.id || 1,
      author_name: req.user?.email || "Thành viên gia đình",
      content,
      created_at: new Date()
    };

    post.comments.push(newComment);
    return res.status(201).json({ message: "Bình luận thành công!", data: newComment });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;

    const post = mockPosts.find(p => p.id == id);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết!" });
    }

    const index = post.likes.indexOf(userId);
    let isLiked = false;

    if (index === -1) {
      post.likes.push(userId); 
      isLiked = true;
    } else {
      post.likes.splice(index, 1);
      isLiked = false;
    }

    return res.status(200).json({
      message: isLiked ? "Đã thích bài viết!" : "Đã bỏ thích bài viết!",
      total_likes: post.likes.length,
      isLiked
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { createPost, getPosts, addComment, likePost };