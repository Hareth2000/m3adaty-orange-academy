import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Wrench,
  Truck,
  Upload,
  Info,
  DollarSign,
  Calendar,
} from "lucide-react";

const EquipmentCreationPage = () => {
  // الحالة الأولية للنموذج
  const initialFormState = {
    title: "",
    description: "",
    category: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    manufacturer: "",
    model: "",
    year: "",
    condition: "",
    features: [],
    availability: true,
    mainImage: null,
    additionalImages: [],
    location: "",
    deliveryOptions: "",
    minRentalDays: "1",
    depositAmount: "",
    technicalSpecs: "",
    rentalTerms: "",
    ownerId: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [Id, setId] = useState(""); // لحفظ userId
  const [currentStep, setCurrentStep] = useState(1);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false); // إضافة حالة التحميل
  const [errors, setErrors] = useState({}); // إضافة حالة للأخطاء

  // دالة لضبط قيم الحقول
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    // مسح الخطأ عند تعديل الحقل
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // الصورة الرئيسية
    if (name === "mainImage") {
      if (files && files.length > 0) {
        setFormData((prevData) => ({ ...prevData, mainImage: files[0] }));
        // للمعاينة
        const reader = new FileReader();
        reader.onload = () => {
          setImagesPreview((prev) => [
            { id: "main", url: reader.result },
            ...prev.filter((img) => img.id !== "main"),
          ]);
        };
        reader.readAsDataURL(files[0]);
      }
    }
    // الصور الإضافية
    else if (name === "additionalImages") {
      if (files && files.length > 0) {
        const additionalImagesArray = Array.from(files);
        setFormData((prevData) => ({
          ...prevData,
          additionalImages: [
            ...prevData.additionalImages,
            ...additionalImagesArray,
          ],
        }));
        // معاينة
        additionalImagesArray.forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imgId = `additional-${Date.now()}-${index}`;
            setImagesPreview((prev) => [
              ...prev,
              { id: imgId, url: reader.result },
            ]);
          };
          reader.readAsDataURL(file);
        });
      }
    }
    // ميزات (features) => مصفوفة
    else if (name === "features") {
      const featuresArray = value
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      setFormData((prevData) => ({ ...prevData, features: featuresArray }));
    }
    // checkbox
    else if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    }
    // باقي الحقول
    else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // إزالة صورة من المعاينة
  const removeImage = (imageId) => {
    setImagesPreview((prev) => prev.filter((img) => img.id !== imageId));
    if (imageId === "main") {
      setFormData((prevData) => ({ ...prevData, mainImage: null }));
    } else {
      // تحليل معرف الصورة للحصول على الفهرس
      const idParts = imageId.split("-");
      const indexStr = idParts[idParts.length - 1];
      const index = parseInt(indexStr);

      if (!isNaN(index) && index >= 0) {
        setFormData((prevData) => ({
          ...prevData,
          additionalImages: prevData.additionalImages.filter(
            (_, i) => i !== index
          ),
        }));
      }
    }
  };

  // التحقق من صحة البيانات قبل الإرسال
  const validateForm = () => {
    const newErrors = {};

    // التحقق من الحقول المطلوبة
    const requiredFields = [
      { key: "title", label: "اسم المعدات" },
      { key: "description", label: "الوصف" },
      { key: "category", label: "الفئة" },
      { key: "dailyRate", label: "السعر اليومي" },
      { key: "manufacturer", label: "المصنع" },
      { key: "model", label: "الموديل" },
      { key: "year", label: "سنة الصنع" },
      { key: "condition", label: "حالة المعدات" },
      { key: "location", label: "الموقع" },
    ];

    requiredFields.forEach(({ key, label }) => {
      if (!formData[key]) {
        newErrors[key] = `حقل ${label} مطلوب`;
      }
    });

    // التحقق من الصورة الرئيسية
    if (!formData.mainImage) {
      newErrors.mainImage = "الصورة الرئيسية مطلوبة";
    }

    // التحقق من صحة القيم العددية
    if (formData.dailyRate && isNaN(parseFloat(formData.dailyRate))) {
      newErrors.dailyRate = "يجب أن يكون السعر اليومي رقماً";
    }

    if (formData.weeklyRate && isNaN(parseFloat(formData.weeklyRate))) {
      newErrors.weeklyRate = "يجب أن يكون السعر الأسبوعي رقماً";
    }

    if (formData.monthlyRate && isNaN(parseFloat(formData.monthlyRate))) {
      newErrors.monthlyRate = "يجب أن يكون السعر الشهري رقماً";
    }

    // التحقق من سنة الصنع
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year);
    if (
      formData.year &&
      (isNaN(year) || year < 1900 || year > currentYear + 1)
    ) {
      newErrors.year = `يجب أن تكون سنة الصنع بين 1900 و ${currentYear + 1}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // جلب userId من السيرفر
  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        if (res.data && res.data.user) {
          console.log("بيانات المستخدم المستلمة:", res.data);

          // Use this:
          const userData = res.data.user;
          setId(userData._id);
          setFormData((prevData) => ({
            ...prevData,
            ownerId: userData._id,
          }));
        } else {
          console.error("❌ معرف المستخدم مفقود.");
          toast.warning(
            "لم يتم العثور على معرف المستخدم، قد تواجه مشكلة عند إضافة المعدات."
          );
        }
      } catch (error) {
        console.error(
          "❌ خطأ في جلب بيانات المستخدم:",
          error.response?.data || error.message
        );
        toast.error("فشل في جلب بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.");
      }
    };
    getUserId();
  }, []);

  // إرسال البيانات - الدالة المحدثة
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!validateForm()) {
      // عرض رسائل الخطأ
      const errorMessages = Object.values(errors);
      errorMessages.forEach((message) => toast.error(message));
      return;
    }

    // إظهار حالة التحميل
    setLoading(true);
    toast.info("جاري إضافة المعدات...", { autoClose: 3000 });

    try {
      console.log("بيانات النموذج قبل الإرسال:", formData);

      const formDataToSend = new FormData();

      // تعبئة الفورم داتا
      for (let key in formData) {
        if (key === "features") {
          // إرسال الميزات كسلسلة نصية مفصولة بفواصل
          formDataToSend.append("features", formData.features.join(","));
        } else if (key === "additionalImages") {
          // إضافة كل صورة إضافية بشكل منفصل
          formData.additionalImages.forEach((image) => {
            formDataToSend.append("additionalImages", image);
          });
        } else if (key === "mainImage" && formData[key]) {
          // إضافة الصورة الرئيسية
          formDataToSend.append(key, formData[key]);
        } else {
          // إضافة باقي الحقول
          formDataToSend.append(key, formData[key]);
        }
      }

      // إرسال طلب POST
      const response = await axios.post(
        "http://localhost:5000/api/equipment/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("استجابة السيرفر:", response.data);
      toast.success("تم إضافة المعدات بنجاح!");

      // إعادة تعيين النموذج (اختياري)
      setFormData(initialFormState);
      setImagesPreview([]);
      setCurrentStep(1);
    } catch (error) {
      console.error("خطأ في إرسال البيانات:", error);

      // عرض رسائل الخطأ التفصيلية
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (Array.isArray(errorData.details)) {
          // عرض كل رسائل الخطأ التفصيلية
          errorData.details.forEach((detail) => {
            toast.error(detail);
          });
        } else if (typeof errorData.details === "string") {
          // رسالة خطأ واحدة تفصيلية
          toast.error(errorData.details);
        } else {
          // رسالة خطأ عامة
          toast.error(errorData.message || "حدث خطأ أثناء إضافة المعدات");
        }
      } else {
        // خطأ في الاتصال
        toast.error(
          "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
        );
      }
    } finally {
      // إنهاء حالة التحميل
      setLoading(false);
    }
  };

  // تبويبات الخطوات
  const nextStep = () => {
    // التحقق من صحة بيانات الخطوة الأولى قبل الانتقال للخطوة التالية
    const fieldsToValidate = [
      "title",
      "description",
      "category",
      "manufacturer",
      "model",
      "year",
      "condition",
      "location",
      "mainImage",
    ];

    const hasErrors = fieldsToValidate.some((field) => {
      if (!formData[field]) {
        setErrors((prev) => ({ ...prev, [field]: `حقل ${field} مطلوب` }));
        return true;
      }
      return false;
    });

    if (hasErrors) {
      toast.error("يرجى إكمال جميع الحقول المطلوبة قبل المتابعة");
      return;
    }

    setCurrentStep(2);
  };

  const prevStep = () => setCurrentStep(1);



  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      {/* عنوان الصفحة */}
      <div className="text-right mb-6">
        <div className="flex justify-end items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            إضافة معدات للتأجير
          </h1>
          <Wrench className="text-yellow-500" size={28} />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          يرجى ملء البيانات التالية لإضافة معدات جديدة للتأجير
        </p>


      </div>

      {/* الخطوة 1 */}
      {currentStep === 1 && (
        <div className="border rounded-lg p-8 shadow-sm bg-white">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-yellow-500">
              معلومات المعدات الأساسية
            </h2>
            <p className="text-sm text-gray-600">
              املأ التفاصيل الأساسية للمعدات المراد تأجيرها
            </p>
          </div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-right mb-1 font-medium">
                  اسم المعدات <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={`w-full border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="مثال: حفارة هيدروليكية كبيرة"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-right mb-1 font-medium">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  className={`w-full border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر الفئة</option>
                  <option value="آليات ثقيلة">آليات ثقيلة</option>
                  <option value="عدد صناعية">عدد صناعية</option>
                  <option value="عدد زراعية">عدد زراعية</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-right mb-1 font-medium">
                الوصف <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                className={`w-full border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="وصف تفصيلي للمعدات وميزاتها الرئيسية"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-right mb-1 font-medium">
                  المصنع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  className={`w-full border ${
                    errors.manufacturer ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="مثال: كاتربيلر"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                />
                {errors.manufacturer && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.manufacturer}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-right mb-1 font-medium">
                  الموديل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  className={`w-full border ${
                    errors.model ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="مثال: 320D"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
                {errors.model && (
                  <p className="text-red-500 text-xs mt-1">{errors.model}</p>
                )}
              </div>
              <div>
                <label className="block text-right mb-1 font-medium">
                  سنة الصنع <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  className={`w-full border ${
                    errors.year ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="مثال: 2020"
                  value={formData.year}
                  onChange={handleChange}
                  min="1980"
                  max="2025"
                  required
                />
                {errors.year && (
                  <p className="text-red-500 text-xs mt-1">{errors.year}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-right mb-1 font-medium">
                  حالة المعدات <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  className={`w-full border ${
                    errors.condition ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر الحالة</option>
                  <option value="جديدة">جديدة</option>
                  <option value="كالجديدة">كالجديدة</option>
                  <option value="ممتازة">ممتازة</option>
                  <option value="جيدة جداً">جيدة جداً</option>
                  <option value="جيدة">جيدة</option>
                  <option value="مستعملة">مستعملة</option>
                </select>
                {errors.condition && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.condition}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-right mb-1 font-medium">
                  الميزات الإضافية
                </label>
                <input
                  type="text"
                  name="features"
                  className="w-full border border-gray-300 rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`"
                  placeholder="أدخل الميزات مفصولة بفواصل"
                  value={formData.features.join(",")}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  مثال: تكييف، نظام تحديد المواقع، كاميرا خلفية
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-right mb-1 font-medium">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className={`w-full border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="المدينة، المنطقة"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>
              <div>
                <label className="block text-right mb-1 font-medium">
                  خيارات التوصيل <span className="text-red-500">*</span>
                </label>
                <select
                  name="deliveryOptions"
                  className={`w-full border ${
                    errors.deliveryOptions
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  value={formData.deliveryOptions}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر خيار التوصيل</option>
                  <option value="متوفر مجاناً">متوفر مجاناً</option>
                  <option value="متوفر برسوم إضافية">متوفر برسوم إضافية</option>
                  <option value="استلام من الموقع فقط">
                    استلام من الموقع فقط
                  </option>
                </select>
                {errors.deliveryOptions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.deliveryOptions}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-right mb-2 font-medium">
                الصورة الرئيسية <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-end">
                <input
                  type="file"
                  name="mainImage"
                  accept="image/*"
                  className={`w-full border ${
                    errors.mainImage ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  يفضل صورة بدقة عالية تظهر المعدات بشكل واضح (الحد الأقصى: 5
                  ميجابايت)
                </p>
                {errors.mainImage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mainImage}
                  </p>
                )}
              </div>

              {imagesPreview.some((img) => img.id === "main") && (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img
                      src={imagesPreview.find((img) => img.id === "main").url}
                      alt="معاينة الصورة الرئيسية"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => removeImage("main")}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>


            <button
              onClick={nextStep}
              type="button"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-2 rounded-md font-medium mt-4 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </form>
        </div>
      )}

      {/* الخطوة 2 */}
      {currentStep === 2 && (
        <div className="border rounded-lg p-8 shadow-sm bg-white">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-yellow-500">
              تفاصيل التأجير والمواصفات الفنية
            </h2>
            <p className="text-sm text-gray-600">
              أدخل الأسعار والمواصفات الفنية والشروط
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                <span>أسعار التأجير</span>
                <DollarSign size={18} className="text-yellow-500" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-right mb-1 font-medium">
                    السعر اليومي (دينار) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    className={`w-full border ${
                      errors.dailyRate ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    placeholder="مثال: 150"
                    min="0"
                    step="0.01"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    required
                  />
                  {errors.dailyRate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dailyRate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-right mb-1 font-medium">
                    السعر الأسبوعي (دينار)
                  </label>
                  <input
                    type="number"
                    name="weeklyRate"
                    className={`w-full border ${
                      errors.weeklyRate ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    placeholder="مثال: 900"
                    min="0"
                    step="0.01"
                    value={formData.weeklyRate}
                    onChange={handleChange}
                  />
                  {errors.weeklyRate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.weeklyRate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-right mb-1 font-medium">
                    السعر الشهري (دينار)
                  </label>
                  <input
                    type="number"
                    name="monthlyRate"
                    className={`w-full border ${
                      errors.monthlyRate ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    placeholder="مثال: 3000"
                    min="0"
                    step="0.01"
                    value={formData.monthlyRate}
                    onChange={handleChange}
                  />
                  {errors.monthlyRate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.monthlyRate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                <span>شروط التأجير</span>
                <Calendar size={18} className="text-yellow-500" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-right mb-1 font-medium">
                    الحد الأدنى لمدة التأجير (بالأيام)
                  </label>
                  <input
                    type="number"
                    name="minRentalDays"
                    className={`w-full border ${
                      errors.minRentalDays
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    placeholder="مثال: 1"
                    min="1"
                    value={formData.minRentalDays}
                    onChange={handleChange}
                    required
                  />
                  {errors.minRentalDays && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.minRentalDays}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-right mb-1 font-medium">
                    مبلغ التأمين (دينار) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="depositAmount"
                    className={`w-full border ${
                      errors.depositAmount
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    placeholder="مثال: 500"
                    min="0"
                    step="0.01"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    required
                  />
                  {errors.depositAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.depositAmount}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <label className="mr-2 font-medium">
                    متاح للتأجير حالياً
                  </label>
                  <input
                    type="checkbox"
                    name="availability"
                    className="w-5 h-5 text-yellow-500 focus:ring-yellow-500"
                    checked={formData.availability}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                <span>المواصفات الفنية</span>
                <Info size={18} className="text-yellow-500" />
              </h3>

              <div>
                <label className="block text-right mb-1 font-medium">
                  المواصفات الفنية <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="technicalSpecs"
                  className={`w-full border ${
                    errors.technicalSpecs ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="أدخل المواصفات الفنية التفصيلية..."
                  rows="4"
                  value={formData.technicalSpecs}
                  onChange={handleChange}
                  required
                />
                {errors.technicalSpecs && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.technicalSpecs}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                <span>شروط وأحكام التأجير</span>
                <Info size={18} className="text-yellow-500" />
              </h3>

              <div>
                <label className="block text-right mb-1 font-medium">
                  شروط التأجير
                </label>
                <textarea
                  name="rentalTerms"
                  className="w-full border border-gray-300 rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`"
                  placeholder="مثل: متطلبات المشغل، الوقود، التأمين..."
                  rows="4"
                  value={formData.rentalTerms}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-right flex items-center justify-end gap-2">
                <span>صور إضافية</span>
                <Upload size={18} className="text-yellow-500" />
              </h3>

              <div>
                <label className="block text-right mb-1 font-medium">
                  صور إضافية للمعدات
                </label>
                <input
                  type="file"
                  name="additionalImages"
                  accept="image/*"
                  multiple
                  className="w-full border border-gray-300 rounded-md p-2 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500`"
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  يمكن تحميل عدة صور (الحد الأقصى 5 صور، كل صورة بحد أقصى 5
                  ميجابايت)
                </p>
              </div>

              {imagesPreview.filter((img) => img.id !== "main").length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 justify-end">
                  {imagesPreview
                    .filter((img) => img.id !== "main")
                    .map((img) => (
                      <div key={img.id} className="relative inline-block">
                        <img
                          src={img.url}
                          alt="صورة إضافية"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() => removeImage(img.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

       

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-800 hover:bg-gray-900 text-white px-10 py-2 rounded-md font-medium transition duration-200"
                disabled={loading}
              >
                الرجوع
              </button>

              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-2 rounded-md font-medium transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "جارِ الإضافة..." : "إضافة المعدات"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast Container للإشعارات */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EquipmentCreationPage;
