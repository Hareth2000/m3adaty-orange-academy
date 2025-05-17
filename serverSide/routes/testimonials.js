const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const isAdmin = require('../Middlewares/isAdmin');
const testimonialController = require('../controllers/testimonialController');

// الحصول على جميع التقييمات المعتمدة
router.get('/approved', testimonialController.getApprovedTestimonials);

// الحصول على جميع التقييمات (للمشرف فقط)
router.get('/all', isAdmin, testimonialController.getAllTestimonials);

// إضافة تقييم جديد
router.post('/', testimonialController.addTestimonial);

// الحصول على تقييمات المستخدم
router.get('/my-testimonials', isAuthenticated, testimonialController.getMyTestimonials);

// تحديث حالة التقييم (للمشرف فقط)
router.patch('/:id/status', isAdmin, testimonialController.updateTestimonialStatus);

// حذف تقييم
router.delete('/:id', isAuthenticated, testimonialController.deleteTestimonial);

module.exports = router; 