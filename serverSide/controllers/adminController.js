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

    // Get rental status counts
    const rentalsPending = await Rental.countDocuments({ status: "pending" });
    const rentalsAccepted = await Rental.countDocuments({ status: "accepted" });
    const rentalsRejected = await Rental.countDocuments({ status: "rejected" });
    const rentalsCompleted = await Rental.countDocuments({ status: "completed" });

    res.json({ 
      users, 
      partnersPending, 
      equipment, 
      rentals, 
      payments, 
      messages,
      rentalsPending,
      rentalsAccepted,
      rentalsRejected,
      rentalsCompleted
    });
  } catch (error) {
    console.error('Stats error:', error);
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
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // Toggle between customer and partner roles
    user.role = user.role === "partner" ? "customer" : "partner";
    
    // If changing to customer, reset partner status
    if (user.role === "customer") {
      user.partnerStatus = null;
    }
    
    await user.save();
    res.json({ message: "تم تغيير الدور" });
  } catch (err) {
    console.error('Role toggle error:', err);
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
    
    // Handle notifications separately to not affect the main approval process
    try {
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
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Continue with the response even if notifications fail
    }
    
    res.json({ message: "تمت الموافقة" });
  } catch (error) {
    console.error('Approval error:', error);
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