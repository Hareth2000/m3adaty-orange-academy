const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "لم يتم العثور على المستخدم" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt,
        partnerStatus: user.partnerStatus,
        companyName: user.companyName,
        businessType: user.businessType,
        yearsOfExperience: user.yearsOfExperience,
        equipmentTypes: user.equipmentTypes,
        taxNumber: user.taxNumber,
        website: user.website,
        description: user.description
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.base": "الاسم يجب أن يكون نصًا",
    "string.min": "الاسم يجب أن يكون على الأقل 3 أحرف",
    "string.max": "الاسم يجب أن لا يتجاوز 50 حرفًا",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      "string.base": "البريد الإلكتروني يجب أن يكون نصًا",
      "string.email": "صيغة البريد الإلكتروني غير صحيحة",
    }),
  phoneNumber: Joi.string().optional().allow(null, "").messages({
    "string.base": "رقم الهاتف يجب أن يكون نصًا",
  }),
  address: Joi.string().optional().allow(null, "").messages({
    "string.base": "العنوان يجب أن يكون نصًا",
  }),
  file: Joi.any().optional(),
});

exports.updateUserProfile = async (req, res) => {
  const { name, email, phoneNumber, address } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  const { error } = profileUpdateSchema.validate(
    { name, email, phoneNumber, address, file: req.file },
    { abortEarly: false }
  );

  if (error) {
    return res.status(400).json({
      message: "خطأ في التحقق",
      errors: error.details.map((err) => err.message),
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber !== undefined ? phoneNumber : user.phoneNumber;
    user.address = address !== undefined ? address : user.address;
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    await user.save();

    res.status(200).json({
      message: "تم تحديث بيانات المستخدم بنجاح",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        profilePicture: user.profilePicture || null,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // مسح الكوكيز
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الخروج' });
  }
};

exports.getUserFromToken = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 6; 
    const skip = (page - 1) * perPage; 

    const users = await User.find().skip(skip).limit(perPage); 
    const totalUser = await User.countDocuments(); 
    const totalPages = Math.ceil(totalUser / perPage);

    res.status(200).json({
      users, // المستخدمين في الصفحة الحالية
      totalUser, // إجمالي عدد المستخدمين
      totalPages, // عدد الصفحات الإجمالي
      currentPage: page, // الصفحة الحالية
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'approved', role: 'journalist' }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.status(200).json({ message: 'تمت الموافقة على المستخدم بنجاح', user });
  } catch (error) {
    console.error('حدث خطأ أثناء الموافقة على المستخدم:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء الموافقة على المستخدم' });
  }
};

exports.getUserRoleFromToken = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { equipmentId } = req.body;
    const userId = req.user.id;

    if (!equipmentId) {
      return res.status(400).json({ message: "يجب توفير معرف المعدات." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود." });
    }

    const isFavorite = user.favorites.includes(equipmentId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== equipmentId);
    } else {
      user.favorites.push(equipmentId);
    }

    await user.save();
    res.status(200).json({ message: isFavorite ? "تمت إزالة المعدات من المفضلة" : "تمت إضافة المعدات إلى المفضلة" });
  } catch (error) {
    console.error("❌ خطأ في تبديل المفضلة:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث المفضلة." });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود." });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("❌ خطأ في جلب المفضلة:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المعدات المفضلة." });
  }
};

exports.registerPartner = async (req, res) => {
  try {
    const { description, companyName, phoneNumber, address, businessType, yearsOfExperience, equipmentTypes, taxNumber, website } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });

    if (user.role === "partner") {
      return res.status(400).json({ message: "المستخدم مسجل كشريك بالفعل." });
    }

    user.description = description;
    user.companyName = companyName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.businessType = businessType;
    user.yearsOfExperience = yearsOfExperience;
    user.equipmentTypes = JSON.parse(equipmentTypes);
    user.taxNumber = taxNumber;
    user.website = website;
    user.role = "partner";

    if (req.files["identityDocument"]) {
      user.identityDocument = req.files["identityDocument"][0].path;
    }

    if (req.files["commercialRegister"]) {
      user.commercialRegister = req.files["commercialRegister"][0].path;
    }

    await user.save();

    res.status(200).json({ message: "تمت ترقية الحساب إلى شريك بنجاح!", user });
  } catch (error) {
    console.error("❌ خطأ أثناء تسجيل الشريك:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الشريك." });
  }
};

exports.requestPartner = async (req, res) => {
  try {
    const {
      description,
      companyName,
      phoneNumber,
      address,
      businessType,
      yearsOfExperience,
      equipmentTypes,
      taxNumber,
      website
    } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });

    if (user.partnerStatus === "pending") {
      return res.status(400).json({ message: "لديك طلب شراكة قيد المعالجة بالفعل." });
    }
    if (user.role === "partner" || user.role === "admin") {
      return res.status(400).json({ message: "هذا الحساب لديه صلاحيات شريك مسبقاً." });
    }

    user.description = description;
    user.companyName = companyName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.businessType = businessType;
    user.yearsOfExperience = yearsOfExperience;
    user.equipmentTypes = JSON.parse(equipmentTypes || "[]");
    user.taxNumber = taxNumber;
    user.website = website;

    user.partnerStatus = "pending";

    if (req.files["identityDocument"]) {
      user.identityDocument = req.files["identityDocument"][0].path;
    }
    if (req.files["commercialRegister"]) {
      user.commercialRegister = req.files["commercialRegister"][0].path;
    }

    await user.save();

    res.status(200).json({ message: "تم إرسال طلب الشراكة بنجاح!", user });
  } catch (error) {
    console.error("❌ خطأ أثناء طلب الشراكة:", error);
    res.status(500).json({ message: "حدث خطأ أثناء طلب الشراكة." });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    res.status(200).json({ message: "تم حذف الحساب بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "فشل في حذف الحساب", error: error.message });
  }
};

exports.getRentalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const rentals = await Rental.find({ userId: userId });
    res.status(200).json(rentals);
  } catch (error) {
    console.error("خطأ في جلب سجل التأجير:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب سجل التأجير" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // التحقق من صحة التوكن
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // البحث عن المستخدم أو إنشاء مستخدم جديد
    let user = await User.findOne({ email });

    if (!user) {
      // إنشاء مستخدم جديد
      user = new User({
        email,
        name,
        profilePicture: picture,
        role: "customer", // تعيين الدور كزبون عادي
        password: Math.random().toString(36).slice(-8) // كلمة مرور عشوائية
      });
      await user.save();
    }

    // إنشاء JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // تعيين الكوكي
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // ساعة واحدة
    });

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
    res.status(500).json({ message: "فشل تسجيل الدخول باستخدام Google" });
  }
};