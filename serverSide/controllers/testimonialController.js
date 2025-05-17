const Testimonial = require('../models/Testimonial');

// جلب جميع التقييمات المعتمدة
async function getApprovedTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({ status: 'approved', isDeleted: false }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// جلب جميع التقييمات (للمشرف فقط)
async function getAllTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// إضافة تقييم جديد
async function addTestimonial(req, res) {
  try {
    const testimonialData = {
      ...req.body,
      status: 'pending' // Set initial status as pending for review
    };
    
    // Only add userId if user is authenticated
    if (req.user) {
      testimonialData.userId = req.user._id;
    }
    
    const testimonial = new Testimonial(testimonialData);
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// جلب تقييمات المستخدم الحالي
async function getMyTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({ userId: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// تحديث حالة التقييم (للمشرف فقط)
async function updateTestimonialStatus(req, res) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'التقييم غير موجود' });
    }
    testimonial.status = req.body.status;
    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// حذف تقييم (soft delete)
async function deleteTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'التقييم غير موجود' });
    }
    if (testimonial.userId && testimonial.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا التقييم' });
    }
    testimonial.isDeleted = true;
    await testimonial.save();
    res.json({ message: 'تم حذف التقييم بنجاح (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getApprovedTestimonials,
  getAllTestimonials,
  addTestimonial,
  getMyTestimonials,
  updateTestimonialStatus,
  deleteTestimonial
}; 