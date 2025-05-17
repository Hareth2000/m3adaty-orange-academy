import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Wrench,
  Truck,
  Upload,
  Building,
  FileCheck,
  MapPin,
  Phone,
  Info,
} from "lucide-react";

const RegisterPartner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: "",
    companyName: "",
    phoneNumber: "",
    address: "",
    businessType: "individual", // individual, company
    yearsOfExperience: "",
    equipmentTypes: [], // types of equipment the partner will provide
    taxNumber: "",
    website: "",
  });
  const [image, setImage] = useState(null);
  const [commercialRegister, setCommercialRegister] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        toast.error(
          error.response?.data?.message || "فشل في جلب بيانات المستخدم"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "equipmentTypes") {
      const updatedTypes = [...formData.equipmentTypes];
      if (checked) {
        updatedTypes.push(value);
      } else {
        const index = updatedTypes.indexOf(value);
        if (index > -1) {
          updatedTypes.splice(index, 1);
        }
      }
      setFormData({ ...formData, equipmentTypes: updatedTypes });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCommercialRegisterChange = (e) => {
    setCommercialRegister(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("يجب الموافقة على الشروط والأحكام للمتابعة");
      return;
    }

    try {
      const submitFormData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "equipmentTypes") {
          submitFormData.append(key, JSON.stringify(formData[key]));
        } else {
          submitFormData.append(key, formData[key]);
        }
      });

      // Add files
      if (image) {
        submitFormData.append("identityDocument", image);
      }

      if (commercialRegister) {
        submitFormData.append("commercialRegister", commercialRegister);
      }

      // تم تغيير المسار من /api/partners/register إلى /api/users/partner-request
      const response = await axios.post(
        "http://localhost:5000/api/users/partner-request",
        submitFormData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        "تم إرسال طلب الانضمام بنجاح، سيتم مراجعته والرد في أقرب وقت"
      );

      // Reset form after successful submission
      setFormData({
        description: "",
        companyName: "",
        phoneNumber: "",
        address: "",
        businessType: "individual",
        yearsOfExperience: "",
        equipmentTypes: [],
        taxNumber: "",
        website: "",
      });
      setImage(null);
      setCommercialRegister(null);
      setTermsAccepted(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في إرسال الطلب");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF7517]"></div>
        <span className="mr-4 text-[#2C2727] text-xl">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        rtl={true}
      />
      <div
        className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto">
          {/* Card Container */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-8 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start">
                {/* Partner Icon */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md">
                  <div className="flex flex-col items-center">
                    <Wrench className="h-12 w-12 text-yellow-500" />
                    <Truck className="h-12 w-12 text-yellow-500 mt-1" />
                  </div>
                </div>

                {/* Header Content */}
                <div className="mt-4 md:mt-0 md:mr-6 text-center md:text-right flex-grow">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    انضم كشريك مزود خدمات التأجير
                  </h1>
                  <p className="text-white/80 mt-2">
                    كن جزءاً من شبكتنا واستفد من توسيع نطاق أعمالك وزيادة أرباحك
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* User Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Info className="ml-2 h-5 w-5 text-yellow-500" />
                  معلوماتك الحالية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="text-sm text-[#2C2727]/70">الاسم</label>
                    <p className="font-medium text-[#2C2727]">{user.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="text-sm text-[#2C2727]/70">
                      البريد الإلكتروني
                    </label>
                    <p className="font-medium text-[#2C2727]">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="ml-2 h-5 w-5 text-yellow-500" />
                  معلومات الشريك
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Type */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="font-medium text-gray-700 block mb-2">
                      نوع العمل
                    </label>
                    <div className="flex space-x-4 space-x-reverse">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="businessType"
                          value="individual"
                          checked={formData.businessType === "individual"}
                          onChange={handleInputChange}
                          className="ml-2 h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span>فرد / مالك معدات</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="businessType"
                          value="company"
                          checked={formData.businessType === "company"}
                          onChange={handleInputChange}
                          className="ml-2 h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span>شركة / مؤسسة</span>
                      </label>
                    </div>
                  </div>

                  {/* Company Name & Phone Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <label className="font-medium text-gray-700 block mb-2">
                        {formData.businessType === "company"
                          ? "اسم الشركة"
                          : "الاسم التجاري (اختياري)"}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder={
                          formData.businessType === "company"
                            ? "اسم الشركة / المؤسسة"
                            : "الاسم التجاري إن وجد"
                        }
                        required={formData.businessType === "company"}
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <label className="font-medium text-gray-700 block mb-2">
                        رقم الهاتف
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="+962 7X XXX XXXX"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address & Years of Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <label className="font-medium text-gray-700 block mb-2">
                        العنوان
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="المدينة، المنطقة، الشارع"
                          required
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <label className="font-medium text-gray-700 block mb-2">
                        سنوات الخبرة
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="عدد سنوات الخبرة في المجال"
                        required
                      />
                    </div>
                  </div>

                  {/* Tax Number & Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.businessType === "company" && (
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <label className="font-medium text-gray-700 block mb-2">
                          الرقم الضريبي
                        </label>
                        <input
                          type="text"
                          name="taxNumber"
                          value={formData.taxNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="الرقم الضريبي إن وجد"
                        />
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <label className="font-medium text-gray-700 block mb-2">
                        الموقع الإلكتروني
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="www.example.com (اختياري)"
                      />
                    </div>
                  </div>

                  {/* Equipment Types */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="font-medium text-gray-700 block mb-2">
                      أنواع المعدات التي ستوفرها
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "معدات ثقيلة",
                        "معدات زراعية",
                        "معدات صناعية",
                        "أخرى",
                      ].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            name="equipmentTypes"
                            value={type}
                            checked={formData.equipmentTypes.includes(type)}
                            onChange={handleInputChange}
                            className="ml-2 h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description Field */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="font-medium text-gray-700 block mb-2">
                      نبذة عنك وعن المعدات التي تمتلكها
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="قدم وصفاً مختصراً عن نفسك أو شركتك، وأنواع المعدات التي تمتلكها، وأي معلومات أخرى قد تكون مفيدة..."
                      required
                    />
                  </div>

                  {/* Document Uploads */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="font-medium text-gray-700 block mb-2 flex items-center">
                      <FileCheck className="ml-2 h-5 w-5 text-yellow-500" />
                      المستندات المطلوبة
                    </label>

                    <div className="mb-4">
                      <label className="block text-gray-600 text-sm mb-2">
                        صورة الهوية الشخصية أو جواز السفر
                      </label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          name="identityDocument"
                          onChange={handleImageChange}
                          className="hidden"
                          id="identity-upload"
                          accept="image/*,.pdf"
                          required
                        />
                        <label
                          htmlFor="identity-upload"
                          className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center text-gray-700 hover:bg-gray-50"
                        >
                          <Upload className="ml-2 h-5 w-5" />
                          <span>اختر ملفاً</span>
                        </label>
                        <span className="mr-3 text-sm text-gray-500">
                          {image ? image.name : "لم يتم اختيار ملف"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        المستندات المقبولة: JPG، PNG، PDF (الحد الأقصى 5
                        ميجابايت)
                      </p>
                    </div>

                    {formData.businessType === "company" && (
                      <div>
                        <label className="block text-gray-600 text-sm mb-2">
                          السجل التجاري (للشركات فقط)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="file"
                            name="commercialRegister"
                            onChange={handleCommercialRegisterChange}
                            className="hidden"
                            id="commercial-upload"
                            accept="image/*,.pdf"
                            required
                          />
                          <label
                            htmlFor="commercial-upload"
                            className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center text-gray-700 hover:bg-gray-50"
                          >
                            <Upload className="ml-2 h-5 w-5" />
                            <span>اختر ملفاً</span>
                          </label>
                          <span className="mr-3 text-sm text-gray-500">
                            {commercialRegister
                              ? commercialRegister.name
                              : "لم يتم اختيار ملف"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 ml-2 h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        أوافق على{" "}
                        <a
                          href="/terms"
                          className="text-yellow-500 hover:underline"
                        >
                          الشروط والأحكام
                        </a>{" "}
                        الخاصة بالانضمام كشريك في منصة المعدات الذهبية وأقر بأن
                        جميع المعلومات المقدمة صحيحة ودقيقة.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md transition-colors duration-300 flex items-center"
                    >
                      <span className="ml-2">إرسال طلب الانضمام</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Partner Benefits Section */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              مميزات الانضمام كشريك
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="mx-auto w-12 h-12 bg-[#FF7517]/10 rounded-full flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#FF7517]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-[#2C2727] mb-2">زيادة الدخل</h3>
                <p className="text-[#2C2727]/70 text-sm">
                  إمكانية تحقيق دخل إضافي من خلال تأجير معداتك في أوقات عدم
                  استخدامها
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="mx-auto w-12 h-12 bg-[#FF7517]/10 rounded-full flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#FF7517]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-[#2C2727] mb-2">
                  توسيع نطاق الأعمال
                </h3>
                <p className="text-[#2C2727]/70 text-sm">
                  الوصول إلى قاعدة عملاء أوسع والحصول على فرص عمل جديدة في مختلف
                  المناطق
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="mx-auto w-12 h-12 bg-[#FF7517]/10 rounded-full flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#FF7517]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-[#2C2727] mb-2">
                  منصة آمنة وموثوقة
                </h3>
                <p className="text-[#2C2727]/70 text-sm">
                  نظام دفع آمن، تحقق من هوية المستأجرين، وحماية تأمينية للمعدات
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPartner;
