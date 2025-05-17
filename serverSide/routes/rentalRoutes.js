// routes/rentalRoutes.js
const express = require("express");
const router = express.Router();
const {
  createRental,
  getRentalsByOwner,
  updateRentalStatus,
  getBookedDates,
  getUserRentals
} = require("../controllers/rentalController");
const auth = require("../Middlewares/authMiddleware");

// إنشاء طلب تأجير جديد
router.post("/", createRental);

// جلب الطلبات الخاصة بمعدات مؤجر معين
router.get("/by-owner", getRentalsByOwner);

// تحديث حالة طلب التأجير (قبول/رفض... إلخ)
router.patch("/:rentalId", updateRentalStatus);

// جلب المواقيت المحجوزة لمعدة معينة
router.get("/equipment/:equipmentId/booked-dates", getBookedDates);

// جلب جميع طلبات التأجير للمستخدم الحالي
router.get("/my-rentals", auth, getUserRentals);

module.exports = router;
