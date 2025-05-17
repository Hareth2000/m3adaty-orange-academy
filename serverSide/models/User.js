// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   googleId: { type: String },
//   role: { type: String, enum: ['journalist', 'reader', 'admin'], default: 'reader' },
//   name: { type: String, required: true },
//   profilePicture: { type: String },
//   savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
//   readingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
//   status: { type: String, enum: ['pending', 'approved', 'rejected','user'], default: 'user' }, 
//   explanation: { type: String },  
//   identityProof: { type: String }, 
//   subscriptions: { type: Object },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('User', userSchema);

// models/User.js
// 
// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   role: { type: String, enum: ["customer", "partner", "admin"], default: "customer" },
//   phoneNumber: { type: String },
//   address: { type: String },
//   companyName: { type: String },
//   businessType: { type: String, enum: ["individual", "company"], default: "individual" },
//   yearsOfExperience: { type: Number },
//   equipmentTypes: [{ type: String }],
//   taxNumber: { type: String },
//   website: { type: String },
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }]
// }, { timestamps: true });

// module.exports = mongoose.model("User", UserSchema);



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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
