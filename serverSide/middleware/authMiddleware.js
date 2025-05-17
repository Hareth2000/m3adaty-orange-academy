const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. جلب التوكن من الكوكيز إذا لم يوجد في الهيدر
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    // 2. أو جلبه من الهيدر
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
    }

    // تحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // جلب المستخدم من قاعدة البيانات
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'غير مصرح لك بالوصول' });
  }
};

module.exports = { protect }; 