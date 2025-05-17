// في ملف routes/contactRoutes.js
const express = require("express");
const { sendMessage } = require("../controllers/contactController");
const router = express.Router();

// تأكد من أن المسار هنا يعبر عن المسار الصحيح
router.post("/contact", sendMessage); // المسار هنا هو /api/users/contact

module.exports = router;
