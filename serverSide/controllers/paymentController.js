// controllers/paymentController.js
const Payment = require("../models/Payment");

// معالجة طلب الدفع
exports.processPayment = async (req, res) => {
  try {
    const { name, email, cardNumber, expiryDate, cvc, zipCode, country, amount } = req.body;

    // **محاكاة عملية الدفع (يجب استبدالها بـ Stripe أو PayPal في المستقبل)**
    if (!cardNumber || !expiryDate || !cvc) {
      return res.status(400).json({ message: "معلومات البطاقة غير كاملة" });
    }

    // إنشاء سجل الدفع في قاعدة البيانات
    const newPayment = new Payment({
      name,
      email,
      cardNumber,
      expiryDate,
      cvc,
      zipCode,
      country,
      amount,
      status: "completed"
    });

    await newPayment.save();

    res.status(200).json({ message: "تم الدفع بنجاح", paymentId: newPayment._id });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء معالجة الدفع", error });
  }
};

// جلب جميع عمليات الدفع
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب المدفوعات", error });
  }
};

// جلب تفاصيل دفع واحدة
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "لم يتم العثور على الدفع" });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب تفاصيل الدفع", error });
  }
};
