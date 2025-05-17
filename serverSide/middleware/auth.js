const jwt = require('jsonwebtoken');
const User = require('../models/User');

// التحقق من تسجيل الدخول
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'يرجى تسجيل الدخول' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // يدعم جميع أنواع التوكنات
    const userId = decoded.userId || decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ message: 'توكن غير صالح' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'يرجى تسجيل الدخول' });
  }
};

// التحقق من صلاحيات الأدمن
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'غير مصرح لك' });
  }
};

module.exports = { isAuthenticated, isAdmin }; 