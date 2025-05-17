import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, Lock, AlertCircle } from "lucide-react";

const Login = ({ switchForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/get-role",
        { withCredentials: true }
      );
      setUserRole(response.data.role);
      return response.data;
    } catch (error) {
      console.error("error fetching user role");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginResponse = await axios.post("http://localhost:5000/api/users/login", formData, {
        withCredentials: true,
      });
      
      const userData = await fetchUserRole();

      if (formData.email === "Admin@gmail.com") {
        window.location.href = "/admin-dashboard";
      } else if (userData?.role === "partner") {
        window.location.href = `/partner/${userData.userId}`;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setError(error.response?.data?.message || "فشل تسجيل الدخول");
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
      <div className="mb-8 text-right">
        <h2 className="text-2xl font-bold text-[#2C2727] mb-2">تسجيل الدخول</h2>
        <p className="text-[#2C2727]/70">
          مرحباً بعودتك! سجل الدخول للوصول إلى منصة تأجير المعدات والآليات
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-right flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
        <div className="text-right">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#2C2727] mb-1"
          >
            البريد الإلكتروني
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Mail className="h-5 w-5 text-yellow-500" />
            </div>
            <input
              id="email"
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
        </div>

        <div className="text-right">
          <div className="flex justify-between items-center mb-1">
            <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600">
              نسيت كلمة المرور؟
            </a>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#2C2727]"
            >
              كلمة المرور
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Lock className="h-5 w-5 text-yellow-500" />
            </div>
            <input
              id="password"
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
        </div>

        <div className="flex items-center justify-end">
          <label
            htmlFor="remember-me"
            className="mr-2 block text-sm text-[#2C2727]"
          >
            تذكرني
          </label>
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-yellow-500 border-gray-300 rounded-xl focus:ring-yellow-500 bg-white"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-yellow-500 text-white py-3 rounded-xl font-medium shadow-lg hover:bg-yellow-600 transition-colors"
          disabled={loading}
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </motion.button>
      </form>

      <p className="text-center text-[#2C2727]/60 mt-8">
        ليس لديك حساب؟{" "}
        <button
          onClick={switchForm}
          className="text-yellow-500 font-medium hover:text-yellow-600"
        >
          إنشاء حساب
        </button>
      </p>
    </motion.div>
  );
};

export default Login;