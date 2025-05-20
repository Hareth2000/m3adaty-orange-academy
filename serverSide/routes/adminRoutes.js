// serverSide/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

// تطبيق middleware على جميع المسارات
router.use(isAuthenticated);
router.use(isAdmin);

// Dashboard stats
router.get("/stats", adminController.getStats);

// Users
router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/toggle-role", adminController.toggleUserRole);

// Equipment
router.get("/equipment", adminController.getAllEquipment);
router.delete("/equipment/:id", adminController.deleteEquipment);

// Rentals
router.get("/rentals", adminController.getAllRentals);
router.put("/rentals/:id/status", adminController.updateRentalStatus);

// Ads (using equipment)
router.get("/ads", adminController.getAllAds);
router.delete("/ads/:id", adminController.deleteAd);

// Partner Requests (from User)
router.get("/partners/pending", adminController.getPendingPartners);
router.put("/partners/:id/approve", adminController.approvePartner);
router.put("/partners/:id/reject", adminController.rejectPartner);

// Payments
router.get("/payments", adminController.getAllPayments);

// Contact Messages
router.get("/messages", adminController.getAllMessages);

module.exports = router;