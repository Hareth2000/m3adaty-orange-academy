// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvc: { type: String, required: true },
    zipCode: { type: String, required: false },
    country: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
