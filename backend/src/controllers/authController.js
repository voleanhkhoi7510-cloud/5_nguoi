const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mảng tạm lưu User để test
const mockUsers = [];
const JWT_SECRET = process.env.JWT_SECRET || 'BiMatFamilyConnect2026SuperSecretKey';

// 1. API ĐĂNG KÝ
const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được đăng ký!' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = {
      id: mockUsers.length + 1,
      full_name,
      email,
      password_hash,
      role_id: 2,
      family_id: 1,
      created_at: new Date()
    };

    mockUsers.push(newUser);
    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. API ĐĂNG NHẬP
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, roleId: user.role_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: { id: user.id, full_name: user.full_name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 3. MIDDLEWARE XÁC THỰC JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Truy cập bị từ chối! Thiếu Token.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

module.exports = { register, login, verifyToken };