// serverSide/controllers/adminController.js
const User = require("../models/User");
const Equipment = require("../models/Equipment");
const Rental = require("../models/Rental");
const Payment = require("../models/Payment");
const ContactMessage = require("../models/ContactMessage");
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

// Dashboard Stats
const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const partnersPending = await User.countDocuments({ partnerStatus: "pending" });
    const equipment = await Equipment.countDocuments();
    const rentals = await Rental.countDocuments();
    const payments = await Payment.countDocuments();
    const messages = await ContactMessage.countDocuments();

    res.json({ users, partnersPending, equipment, rentals, payments, messages });
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب الإحصائيات" });
  }
};

// Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role partnerStatus");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب المستخدمين" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف المستخدم" });
  } catch (err) {
    res.status(500).json({ message: "فشل في حذف المستخدم" });
  }
};

const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.role = user.role === "admin" ? "customer" : "admin";
    await user.save();
    res.json({ message: "تم تغيير الدور" });
  } catch (err) {
    res.status(500).json({ message: "فشل في تغيير الدور" });
  }
};

// Equipment
const getAllEquipment = async (req, res) => {
  try {
    const all = await Equipment.find().populate("ownerId", "name email");
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب المعدات" });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف المعدة" });
  } catch (error) {
    res.status(500).json({ message: "فشل في حذف المعدة" });
  }
};

// Rentals
const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("user", "name")
      .populate("equipment", "title");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب الطلبات" });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Rental.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "تم تحديث الحالة" });
  } catch (error) {
    res.status(500).json({ message: "فشل في تحديث الحالة" });
  }
};

// Ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Equipment.find().populate("ownerId", "name");
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب الإعلانات" });
  }
};

const deleteAd = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف الإعلان" });
  } catch (error) {
    res.status(500).json({ message: "فشل في حذف الإعلان" });
  }
};

// Partner Requests
const getPendingPartners = async (req, res) => {
  try {
    const users = await User.find({ partnerStatus: "pending" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب طلبات الشراكة" });
  }
};

const approvePartner = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      role: "partner",
      partnerStatus: "approved",
    }, { new: true });
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    // إنشاء إشعار
    await Notification.create({
      user: user._id,
      title: "تمت الموافقة على طلب الشراكة",
      message: "تمت الموافقة على طلبك كشريك. الرجاء إكمال عملية الدفع لإتمام التفعيل."
    });
    // إرسال إيميل
    await sendEmail(
      user.email,
      "تمت الموافقة على طلب الشراكة",
      "تمت الموافقة على طلبك كشريك. الرجاء إكمال عملية الدفع لإتمام التفعيل."
    );
    res.json({ message: "تمت الموافقة" });
  } catch (error) {
    res.status(500).json({ message: "فشل في الموافقة" });
  }
};

const rejectPartner = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      partnerStatus: "rejected",
    });
    res.json({ message: "تم الرفض" });
  } catch (error) {
    res.status(500).json({ message: "فشل في الرفض" });
  }
};

// Payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب المدفوعات" });
  }
};

// Contact Messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب الرسائل" });
  }
};

module.exports = {
  getStats,
  getUsers,
  deleteUser,
  toggleUserRole,
  getAllEquipment,
  deleteEquipment,
  getAllRentals,
  updateRentalStatus,
  getAllAds,
  deleteAd,
  getPendingPartners,
  approvePartner,
  rejectPartner,
  getAllPayments,
  getAllMessages,
};