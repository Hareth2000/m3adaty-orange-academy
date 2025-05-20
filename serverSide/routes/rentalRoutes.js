// routes/rentalRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createRental,
  getRentalsByOwner,
  updateRentalStatus,
  getBookedDates,
  getUserRentals,
  processPayment,
  getRentalById
} = require("../controllers/rentalController");
const auth = require("../Middlewares/authMiddleware");
const { isAuthenticated } = require('../middleware/auth');

// إعداد multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/id-images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'id-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG'));
    }
  }
});

// إنشاء طلب تأجير جديد
router.post("/", upload.single('idImage'), createRental);

// جلب الطلبات الخاصة بمعدات مؤجر معين
router.get("/by-owner", getRentalsByOwner);

// تحديث حالة طلب التأجير (قبول/رفض... إلخ)
router.patch("/:rentalId", updateRentalStatus);

// جلب المواقيت المحجوزة لمعدة معينة
router.get("/equipment/:equipmentId/booked-dates", getBookedDates);

// جلب جميع طلبات التأجير للمستخدم الحالي
router.get("/my-rentals", auth, getUserRentals);

router.post('/:id/pay', isAuthenticated, processPayment);
router.get('/:id', isAuthenticated, getRentalById);

module.exports = router;
