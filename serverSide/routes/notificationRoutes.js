const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const Notification = require('../models/Notification');
const router = express.Router();

// إنشاء إشعار جديد
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { userId, title, message, type, rental } = req.body;
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      rental
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'فشل في إنشاء الإشعار' });
  }
});

// جلب كل إشعارات المستخدم
router.get('/', isAuthenticated, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// تعليم إشعار كمقروء
router.post('/mark-read/:id', isAuthenticated, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

// حذف إشعار (اختياري)
router.delete('/:id', isAuthenticated, async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ success: true });
});

module.exports = router; 