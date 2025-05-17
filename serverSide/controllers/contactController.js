const ContactMessage = require("../models/ContactMessage");

// إرسال رسالة الاتصال
const sendMessage = async (req, res) => {
  const { user_id, name, email, subject, message } = req.body;

  try {
    const newMessage = new ContactMessage({
      user_id,
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();
    return res
      .status(201)
      .json({ success: true, message: "تم إرسال الرسالة بنجاح!" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ أثناء إرسال الرسالة." });
  }
};

module.exports = {
  sendMessage,
};
