import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

const Register = ({ switchForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return false;
    }

    if (formData.password.length < 8) {
      setError("يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await axios.post("http://localhost:5000/api/users/register", dataToSend, {
        withCredentials: true,
      });
      alert("تم التسجيل بنجاح!");
      switchForm();
    } catch (error) {
      setError(error.response?.data?.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rtl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col"
      >
        <div className="mb-8 text-right">
          <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <User className="h-6 w-6 text-yellow-500" />
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-600 text-lg">
            انضم إلينا اليوم واستفد من خدمات تأجير المعدات والآليات الصناعية
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 text-red-600 p-4 rounded-xl mb-6 text-right flex items-center gap-2">
            <span>{error}</span>
            <AlertCircle className="h-5 w-5" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
          <div className="text-right">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <User className="h-4 w-4 text-yellow-500" />
              الاسم الكامل
            </label>
            <input
              id="name"
              type="text"
              placeholder="أدخل اسمك الكامل"
              className="w-full p-3.5 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-right text-gray-700 placeholder-gray-400"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              dir="rtl"
            />
          </div>

          <div className="text-right">
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Mail className="h-4 w-4 text-yellow-500" />
              البريد الإلكتروني
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="your@email.com"
              className="w-full p-3.5 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-left text-gray-700 placeholder-gray-400"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              dir="ltr"
            />
          </div>

          <div className="text-right">
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-yellow-500" />
              كلمة المرور
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3.5 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-left text-gray-700 placeholder-gray-400"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              dir="ltr"
            />
          </div>

          <div className="text-right">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-yellow-500" />
              تأكيد كلمة المرور
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3.5 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-left text-gray-700 placeholder-gray-400"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              dir="ltr"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>يجب أن تحتوي على 8 أحرف على الأقل</span>
            </p>
          </div>

          <div className="flex items-start gap-2 mt-4">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 bg-white mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
              أوافق على{" "}
              <a
                href="#"
                className="text-yellow-500 hover:text-yellow-600 hover:underline transition-colors"
              >
                الشروط والأحكام
              </a>{" "}
              و{" "}
              <a
                href="#"
                className="text-yellow-500 hover:text-yellow-600 hover:underline transition-colors"
              >
                سياسة الخصوصية
              </a>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-l from-yellow-500 to-yellow-600 text-white py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin ml-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري إنشاء الحساب...
              </div>
            ) : (
              "إنشاء حساب"
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 mt-8">
          لديك حساب بالفعل؟{" "}
          <button
            onClick={switchForm}
            className="text-yellow-500 font-medium hover:text-yellow-600 transition-colors"
          >
            تسجيل الدخول
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;