const Equipment = require("../models/Equipment");
const Review = require("../models/Review");
const path = require("path");
const fs = require("fs");

// إنشاء معدات جديدة
exports.createEquipment = async (req, res) => {
  try {
    // سجلات تصحيح مفصلة
    console.log("=== بيانات الطلب ===");
    console.log("الجسم:", req.body);
    console.log("الملفات:", req.files);

    // التحقق من وجود الملفات
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ 
        message: "بيانات غير مكتملة", 
        details: "الصورة الرئيسية مطلوبة" 
      });
    }

    // استخراج البيانات من الطلب
    let {
      title,
      description,
      category,
      dailyRate,
      weeklyRate,
      monthlyRate,
      manufacturer,
      model,
      year,
      condition,
      features,
      location,
      deliveryOptions,
      minRentalDays,
      depositAmount,
      technicalSpecs,
      rentalTerms,
      ownerId,
      availability,
    } = req.body;

    // تحويل النصوص إلى أرقام حيثما يلزم
    dailyRate = parseFloat(dailyRate);
    if (weeklyRate) weeklyRate = parseFloat(weeklyRate);
    if (monthlyRate) monthlyRate = parseFloat(monthlyRate);
    year = parseInt(year);
    minRentalDays = parseInt(minRentalDays || "1");
    if (depositAmount) depositAmount = parseFloat(depositAmount);

    // تحويل availability إلى قيمة منطقية
    if (typeof availability === 'string') {
      availability = availability.toLowerCase() === 'true';
    }

    // معالجة ميزات المعدات
    let finalFeatures = [];
    if (Array.isArray(features)) {
      finalFeatures = features.filter(Boolean);
    } else if (typeof features === 'string') {
      finalFeatures = features
        .split(",")
        .map(f => f.trim())
        .filter(Boolean);
    }

    // الحصول على مسارات الملفات
    const mainImage = req.files.mainImage[0].path;
    const additionalImages = req.files.additionalImages 
      ? req.files.additionalImages.map(file => file.path) 
      : [];

    // إنشاء كائن المعدات الجديد
    const newEquipment = new Equipment({
      title,
      description,
      category,
      dailyRate,
      weeklyRate,
      monthlyRate,
      manufacturer,
      model,
      year,
      condition,
      features: finalFeatures,
      location,
      deliveryOptions,
      minRentalDays,
      depositAmount,
      technicalSpecs,
      rentalTerms,
      ownerId,
      mainImage,
      additionalImages,
      availability,
    });

    // التحقق من صحة البيانات قبل الحفظ
    const validationError = newEquipment.validateSync();
    if (validationError) {
      console.error("خطأ في التحقق من البيانات:", validationError);
      return res.status(400).json({
        message: "خطأ في البيانات المدخلة",
        details: Object.values(validationError.errors).map(err => err.message)
      });
    }

    // حفظ المعدات في قاعدة البيانات
    await newEquipment.save();
    console.log("✅ تم إضافة المعدات بنجاح:", newEquipment._id);
    
    res.status(201).json({
      message: "تمت إضافة المعدات بنجاح!",
      equipment: newEquipment,
    });
  } catch (error) {
    console.error("❌ خطأ في إضافة المعدات:", error);
    
    // معالجة أنواع مختلفة من الأخطاء
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "خطأ في البيانات المدخلة",
        details: Object.values(error.errors).map(err => err.message)
      });
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({
        message: "خطأ: هذه المعدات موجودة بالفعل",
        details: "توجد معدات مسجلة بنفس البيانات"
      });
    }
    
    res.status(500).json({ 
      message: "حدث خطأ أثناء إضافة المعدات", 
      details: error.message 
    });
  }
};

// جلب جميع المعدات مع التصفية والبحث
exports.getAllEquipment = async (req, res) => {
  try {
    let { page, limit, category, search, minPrice, maxPrice, sortBy } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    let query = {};

    if (category && category !== "الكل") query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };
    
    // إدارة نطاق السعر
    if (minPrice || maxPrice) {
      query.dailyRate = {};
      if (minPrice) query.dailyRate.$gte = parseFloat(minPrice);
      if (maxPrice) query.dailyRate.$lte = parseFloat(maxPrice);
    }

    // خيارات الترتيب
    let sortOption = {};
    if (sortBy === "price_asc") sortOption.dailyRate = 1;
    if (sortBy === "price_desc") sortOption.dailyRate = -1;
    if (sortBy === "rating") sortOption.averageRating = -1;
    if (sortBy === "newest") sortOption.createdAt = -1;

    const equipment = await Equipment.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Equipment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: equipment,
      pagination: { totalPages, currentPage: page, total },
    });
  } catch (error) {
    console.error("خطأ في جلب المعدات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المعدات", error: error.message });
  }
};

// جلب تفاصيل المعدات
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate("ownerId", "name createdAt");
    if (!equipment) {
      return res.status(404).json({ message: "المعدة غير موجودة" });
    }
    res.status(200).json(equipment);
  } catch (error) {
    console.error("خطأ في جلب تفاصيل المعدات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المعدات", error: error.message });
  }
};

// زيادة عدد المشاهدات
exports.incrementViewCount = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!equipment) {
      return res.status(404).json({ message: "المعدة غير موجودة" });
    }
    res.status(200).json({ views: equipment.views });
  } catch (error) {
    console.error("خطأ في تحديث عدد المشاهدات:", error);
    res.status(500).json({ message: "خطأ في تحديث عدد المشاهدات", error: error.message });
  }
};

// إرسال بلاغ عن تقييم
exports.reportReview = async (req, res) => {
  try {
    const { reason } = req.body;
    console.log(`بلاغ عن التقييم ${req.params.reviewId}: ${reason}`);
    res.status(200).json({ message: "تم إرسال البلاغ بنجاح" });
  } catch (error) {
    console.error("خطأ في إرسال البلاغ:", error);
    res.status(500).json({ message: "حدث خطأ أثناء الإبلاغ عن التقييم", error: error.message });
  }
};

// إضافة تقييم جديد
exports.addReview = async (req, res) => {
  try {
    const { userId, content, rating } = req.body;
    const equipmentId = req.params.id;

    const newReview = new Review({ userId, equipmentId, content, rating });
    await newReview.save();

    // تحديث متوسط التقييمات
    const reviews = await Review.find({ equipmentId });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Equipment.findByIdAndUpdate(equipmentId, { averageRating });

    res.status(201).json({ message: "تم إضافة التقييم بنجاح", averageRating });
  } catch (error) {
    console.error("خطأ في إضافة التقييم:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة التقييم", error: error.message });
  }
};

// جلب جميع التقييمات لمعدة معينة
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ equipmentId: req.params.id }).populate(
      "userId",
      "name"
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("خطأ في جلب التقييمات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب التقييمات", error: error.message });
  }
};

// جلب المعدات بناءً على ownerId (المؤجر)
exports.getEquipmentByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;  // سنستعمله من المسار /owner/:ownerId
    let { page, limit } = req.query;

    // تحويل القيم لسندها
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    // تجهيز الاستعلام
    const query = { ownerId };
    
    // تنفيذ الاستعلام مع التصفح (Pagination)
    const totalEquipment = await Equipment.countDocuments(query);
    const totalPages = Math.ceil(totalEquipment / limit);

    // جلب المعدات
    const equipment = await Equipment.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // ترتيب اختياري

    res.json({
      equipment,
      totalEquipment,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("خطأ في جلب المعدات الخاصة بالمؤجر:", error);
    res.status(500).json({ message: "فشل في جلب المعدات" });
  }
};

// Update equipment status
exports.updateEquipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Find the equipment
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: "المعدة غير موجودة" });
    }

    // Check if the user is the owner
    if (equipment.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "غير مصرح لك بتحديث حالة هذه المعدة" });
    }

    // Update the status
    equipment.availability = status;
    await equipment.save();

    res.json({
      message: "تم تحديث حالة المعدة بنجاح",
      equipment
    });
  } catch (error) {
    console.error("Error updating equipment status:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "معرف المعدة غير صالح" });
    }
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث حالة المعدة",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// تحديث معلومات المعدة
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // البحث عن المعدة
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: "المعدة غير موجودة" });
    }

    // تحويل النصوص إلى أرقام حيثما يلزم
    if (updateData.dailyRate) updateData.dailyRate = parseFloat(updateData.dailyRate);
    if (updateData.weeklyRate) updateData.weeklyRate = parseFloat(updateData.weeklyRate);
    if (updateData.monthlyRate) updateData.monthlyRate = parseFloat(updateData.monthlyRate);
    if (updateData.year) updateData.year = parseInt(updateData.year);
    if (updateData.minRentalDays) updateData.minRentalDays = parseInt(updateData.minRentalDays);
    if (updateData.depositAmount) updateData.depositAmount = parseFloat(updateData.depositAmount);

    // معالجة المميزات إذا كانت موجودة
    if (updateData.features) {
      if (Array.isArray(updateData.features)) {
        updateData.features = updateData.features.filter(Boolean);
      } else if (typeof updateData.features === 'string') {
        updateData.features = updateData.features
          .split(",")
          .map(f => f.trim())
          .filter(Boolean);
      }
    }

    // تحديث المعدة
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      message: "تم تحديث المعدة بنجاح",
      equipment: updatedEquipment
    });
  } catch (error) {
    console.error("Error updating equipment:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "خطأ في البيانات المدخلة",
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث المعدة",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// جلب المعدات حسب التصنيف
exports.getEquipmentByCategory = async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const equipment = await Equipment.find(query)
      .limit(parseInt(limit) || 10)
      .select('title mainImage dailyRate category');

    res.status(200).json(equipment);
  } catch (error) {
    console.error("خطأ في جلب المعدات حسب التصنيف:", error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء جلب المعدات", 
      error: error.message 
    });
  }
};