const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const { getAllUsers, approveUser } = require("../controllers/userController");
const {
  toggleFavorite,
  getUserFavorites,
} = require("../controllers/userController");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUserFromToken,
  registerPartner,
  getUserRoleFromToken,
  requestPartner,
  deleteUserAccount,
  getRentalHistory,
  googleLogin
} = require("../controllers/userController");

const verifyToken = require("../Middlewares/authMiddleware");

router.get("/users", getAllUsers);
router.put("/users/approve/:userId", approveUser);

router.post("/partners/register", verifyToken, upload.fields([
  { name: "identityDocument", maxCount: 1 },
  { name: "commercialRegister", maxCount: 1 }
]), registerPartner);

// المسار الجديد لطلب الشراكة (بدون تغيير الدور مباشرة):
router.post(
  "/partner-request",
  verifyToken,
  upload.fields([
    { name: "identityDocument", maxCount: 1 },
    { name: "commercialRegister", maxCount: 1 },
  ]),
  requestPartner
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

router.post("/toggle-favorite", verifyToken, toggleFavorite);
router.get("/favorites", verifyToken, getUserFavorites);
router.delete("/delete", verifyToken, deleteUserAccount);
router.get("/history", verifyToken, getRentalHistory);

// جلب بيانات المستخدم
router.get("/profile", verifyToken, getUserProfile);

// تحديث بيانات المستخدم
router.put(
  "/profile",
  verifyToken,
  upload.single("profilePicture"), // رفع ملف باسم "profilePicture"
  updateUserProfile
);
router.post("/logout", logoutUser);
router.get("/get-user", getUserFromToken);
router.get("/get-role", getUserRoleFromToken);

module.exports = router;
