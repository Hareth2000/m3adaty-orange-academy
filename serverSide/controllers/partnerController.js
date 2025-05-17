// controllers/partnerController.js (مثال)
exports.getPartnerStats = async (req, res) => {
    try {
      const { ownerId } = req.params;
  
      // هنا ضع منطق حساب الإحصائيات، مثل:
      // إجمالي الدخل، عدد الطلبات الكلية، عدد الطلبات الناشطة... إلخ
      // هذا مجرد مثال ثابت:
      const totalRentals = 10;
      const activeRentals = 2;
      const completedRentals = 8;
      const totalRevenue = 1500;
      const averageRating = 4.5;
  
      return res.json({
        totalRentals,
        activeRentals,
        completedRentals,
        totalRevenue,
        averageRating,
      });
    } catch (error) {
      console.error("خطأ في حساب إحصائيات الشريك:", error);
      res.status(500).json({ message: "فشل في جلب إحصائيات الشريك" });
    }
  };
  