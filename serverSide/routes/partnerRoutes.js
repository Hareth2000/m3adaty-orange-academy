// routes/partnerRoutes.js
const express = require("express");
const router = express.Router();
const { getPartnerStats } = require("../controllers/partnerController");

// GET /api/partners/stats/:ownerId
router.get("/stats/:ownerId", getPartnerStats);

module.exports = router;
