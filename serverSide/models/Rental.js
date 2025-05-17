// models/Rental.js
const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      // أضفنا accepted و rejected
      type: String,
      enum: ["pending", "accepted", "rejected", "paid", "cancelled"],
      default: "pending",
    },  price: {  // إضافة السعر الإجمالي
      type: Number,
      required: true, // تأكد من أن السعر يجب أن يكون موجودًا
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Rental", RentalSchema);
