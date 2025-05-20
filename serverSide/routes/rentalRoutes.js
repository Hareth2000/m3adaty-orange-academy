// routes/rentalRoutes.js
const express = require("express");
const router = express.Router();
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

router.post('/:id/pay', isAuthenticated, processPayment);
router.get('/:id', isAuthenticated, getRentalById);

module.exports = router;
