// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { processPayment, getPayments, getPaymentById } = require("../controllers/paymentController");

router.post("/", processPayment);  // طلب الدفع
router.get("/", getPayments);      // جلب جميع المدفوعات
router.get("/:id", getPaymentById); // جلب تفاصيل مدفوعات محددة

module.exports = router;
