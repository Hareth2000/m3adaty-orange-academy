// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    // الأدوار الرئيسية:
    // customer = زبون عادي
    // partner = شريك (مؤجر)
    // admin = مسؤول
    role: {
      type: String,
      enum: ["customer", "partner", "admin"],
      default: "customer",
    },

    // حالة الشراكة: none = لا يوجد طلب، pending = طلب قيد الانتظار، approved = موافق عليه، rejected = مرفوض
    partnerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    phoneNumber: { type: String },
    address: { type: String },
    companyName: { type: String },
    businessType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },
    yearsOfExperience: { type: Number },
    equipmentTypes: [{ type: String }],
    taxNumber: { type: String },
    website: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],

    // حقول لرفع الملفات:
    identityDocument: { type: String },
    commercialRegister: { type: String },
    profilePicture: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
