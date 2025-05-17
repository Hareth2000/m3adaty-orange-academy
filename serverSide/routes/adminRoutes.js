// serverSide/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const isAdmin = require("../Middlewares/isAdmin");
const adminController = require("../controllers/adminController");

// Dashboard stats
router.get("/stats", isAdmin, adminController.getStats);

// Users
router.get("/users", isAdmin, adminController.getUsers);
router.delete("/users/:id", isAdmin, adminController.deleteUser);
router.put("/users/:id/toggle-role", isAdmin, adminController.toggleUserRole);

// Equipment
router.get("/equipment", isAdmin, adminController.getAllEquipment);
router.delete("/equipment/:id", isAdmin, adminController.deleteEquipment);

// Rentals
router.get("/rentals", isAdmin, adminController.getAllRentals);
router.put("/rentals/:id/status", isAdmin, adminController.updateRentalStatus);

// Ads (using equipment)
router.get("/ads", isAdmin, adminController.getAllAds);
router.delete("/ads/:id", isAdmin, adminController.deleteAd);

// Partner Requests (from User)
router.get("/partners/pending", isAdmin, adminController.getPendingPartners);
router.put("/partners/:id/approve", isAdmin, adminController.approvePartner);
router.put("/partners/:id/reject", isAdmin, adminController.rejectPartner);

// Payments
router.get("/payments", isAdmin, adminController.getAllPayments);

// Contact Messages
router.get("/messages", isAdmin, adminController.getAllMessages);

module.exports = router;