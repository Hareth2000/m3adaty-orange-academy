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
      // Assuming you have a toast notification system
      // toast.success("تم التسجيل بنجاح!");
      alert("تم التسجيل بنجاح!"); // Fallback if no toast system
      switchForm();
    } catch (error) {
      setError(error.response?.data?.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <div className="mb-6 text-right">
        <h2 className="text-2xl font-bold text-[#2C2727] mb-2 flex items-center justify-end gap-2">
          <User className="h-6 w-6 text-yellow-500" />
          إنشاء حساب جديد
        </h2>
        <p className="text-[#2C2727]/70">
          انضم إلينا اليوم واستفد من خدمات تأجير المعدات والآليات الصناعية
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 text-red-600 p-4 rounded-xl mb-6 text-right flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
        <div className="text-right">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#2C2727] mb-1 flex items-center gap-1 justify-end"
          >
            الاسم الكامل
            <User className="h-4 w-4 text-yellow-500" />
          </label>
          <input
            id="name"
            type="text"
            placeholder="أدخل اسمك الكامل"
            className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-right"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            dir="rtl"
          />
        </div>

        <div className="text-right">
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-[#2C2727] mb-1 flex items-center gap-1 justify-end"
          >
            البريد الإلكتروني
            <Mail className="h-4 w-4 text-yellow-500" />
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-right"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            dir="rtl"
          />
        </div>

        <div className="text-right">
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-[#2C2727] mb-1 flex items-center gap-1 justify-end"
          >
            كلمة المرور
            <Lock className="h-4 w-4 text-yellow-500" />
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="••••••••"
            className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-right"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            dir="rtl"
          />
        </div>

        <div className="text-right">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-[#2C2727] mb-1 flex items-center gap-1 justify-end"
          >
            تأكيد كلمة المرور
            <Lock className="h-4 w-4 text-yellow-500" />
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-right"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
            dir="rtl"
          />
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-end">
            <span>يجب أن تحتوي على 8 أحرف على الأقل</span>
            <CheckCircle className="h-3 w-3 text-green-500" />
          </p>
        </div>

        <div className="flex items-start justify-end mt-4">
          <label htmlFor="terms" className="ml-2 block text-sm text-[#2C2727]">
            أوافق على{" "}
            <a
              href="#"
              className="text-yellow-500 hover:text-yellow-600 hover:underline"
            >
              الشروط والأحكام
            </a>{" "}
            و{" "}
            <a
              href="#"
              className="text-yellow-500 hover:text-yellow-600 hover:underline"
            >
              سياسة الخصوصية
            </a>
          </label>
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-yellow-500 border-gray-300 rounded-xl focus:ring-yellow-500 bg-white"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all mt-4"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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

      <p className="text-center text-[#2C2727]/60 mt-8">
        لديك حساب بالفعل؟{" "}
        <button
          onClick={switchForm}
          className="text-yellow-500 font-medium hover:text-yellow-600"
        >
          تسجيل الدخول
        </button>
      </p>
    </motion.div>
  );
};

export default Register;
