// models/Equipment.js
const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    // تحديث القيم المسموحة للحالة لتتوافق مع النموذج
    condition: { 
      type: String, 
      enum: ["جديدة", "كالجديدة", "ممتازة", "جيدة جداً", "جيدة", "مستعملة"], 
      required: true 
    },
    dailyRate: { type: Number, required: true },
    weeklyRate: { type: Number },
    monthlyRate: { type: Number },
    depositAmount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 4.5 },
    mainImage: { type: String, required: true },
    additionalImages: [{ type: String }],
    minRentalDays: { type: Number, default: 1 },
    deliveryOptions: { type: String },
    technicalSpecs: { type: String },
    rentalTerms: { type: String },
    features: [{ type: String }],
    availability: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", EquipmentSchema);