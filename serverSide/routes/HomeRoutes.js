const express = require("express");
const {
  getHealtArticles,
  getPolicyArticles,
  getArgArticles,
} = require("../controllers/HomeController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Middleware to verify the user

const router = express.Router();

// Protected route to fetch saved articles for the authenticated user
router.get("/health", getHealtArticles);
router.get("/policy", getPolicyArticles);
router.get("/arg", getArgArticles);

module.exports = router;
