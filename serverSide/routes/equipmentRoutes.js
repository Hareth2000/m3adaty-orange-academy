const express = require("express");
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  incrementViewCount,
  addReview,
  getReviews,
  reportReview,
  createEquipment,
  getEquipmentByOwner,
  updateEquipmentStatus,
  checkAvailability,
  getBookedDates,
  getEquipmentByCategory,
  updateEquipment
} = require("../controllers/equipmentController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// التأكد من وجود مجلد uploads
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
  console.log("✅ تم إنشاء مجلد uploads بنجاح");
}

// تكوين وحدة التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // إنشاء اسم فريد للملف مع الاحتفاظ بامتداد الملف الأصلي
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// فلتر الملفات للتأكد من أنها صور فقط
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم، يرجى استخدام صور بصيغة JPEG, JPG, PNG, أو GIF فقط.'), false);
  }
};

// تكوين multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 ميجابايت
  }
});

// معالج أخطاء multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("خطأ Multer:", err);
    // أخطاء خاصة بـ multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: "خطأ في تحميل الملف", 
        details: "حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت." 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: "خطأ في تحميل الملف",
        details: "تم استلام ملف غير متوقع، يرجى التحقق من أسماء الحقول."
      });
    }
    return res.status(400).json({ 
      message: "خطأ في تحميل الملف", 
      details: err.message 
    });
  }
  
  // أنواع أخرى من الأخطاء
  if (err) {
    console.error("خطأ عام:", err);
    return res.status(400).json({ 
      message: "خطأ في تحميل الملف", 
      details: err.message 
    });
  }
  
  next();
};

// مسار إنشاء معدات جديدة مع معالجة أخطاء multer
router.post(
  "/create",
  (req, res, next) => {
    const uploadFields = upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 5 },
    ]);
    
    uploadFields(req, res, (err) => {
      if (err) {
        return handleMulterErrors(err, req, res, next);
      }
      next();
    });
  },
  createEquipment
);

// مسارات أخرى
router.get("/all", getAllEquipment);
router.get("/:id", getEquipmentById);
router.post("/:id/view", incrementViewCount);
router.post("/:id/rate", addReview);
router.get("/:id/reviews", getReviews);
router.post("/reviews/report/:reviewId", reportReview);
// جلب المعدات لمالك معين (by ownerId)
router.get("/owner/:ownerId", getEquipmentByOwner);

// جلب المعدات حسب التصنيف
router.get("/", getEquipmentByCategory);

// Update equipment status
router.patch("/:id/status", protect, updateEquipmentStatus);

// مسار تحديث المعدة
router.put("/:id", updateEquipment);

module.exports = router;