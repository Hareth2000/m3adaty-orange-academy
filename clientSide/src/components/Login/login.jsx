import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

// إضافة التنسيقات المخصصة
const googleButtonStyles = {
  width: '100%',
  height: '48px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transform: 'translateY(-1px)'
  }
};

const Login = ({ switchForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

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
        data: { ...formData, rememberMe },
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      const userData = await fetchUserRole();
      
      if (userData?.role === "partner") {
        window.location.href = `/partner/${userData.userId}`;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setError(error.response?.data?.message || "فشل تسجيل الدخول باستخدام Google");
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
          <h2 className="text-3xl font-bold text-gray-800 mb-3">تسجيل الدخول</h2>
          <p className="text-gray-600 text-lg">
            مرحباً بعودتك! سجل الدخول للوصول إلى منصة تأجير المعدات والآليات
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 text-red-600 p-4 rounded-xl mb-6 text-right flex items-center gap-2">
            <span>{error}</span>
            <AlertCircle className="h-5 w-5" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
          <div className="text-right">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Mail className="h-4 w-4 text-yellow-500" />
              البريد الإلكتروني
            </label>
            <input
              id="email"
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
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-yellow-500" />
              كلمة المرور
            </label>
            <input
              id="password"
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

          <div className="flex items-center gap-2 mt-4">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 bg-white"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              htmlFor="remember-me"
              className="text-sm text-gray-700"
            >
              تذكرني
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-l from-yellow-500 to-yellow-600 text-white py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </motion.button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("فشل تسجيل الدخول باستخدام Google");
              }}
              render={renderProps => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-6 h-6"
                    />
                    <span className="text-base">تسجيل الدخول باستخدام Google</span>
                  </div>
                </motion.button>
              )}
            />
          </div>
        </div>

        <p className="text-center text-gray-600 mt-8">
          ليس لديك حساب؟{" "}
          <button
            onClick={switchForm}
            className="text-yellow-500 font-medium hover:text-yellow-600 transition-colors"
          >
            إنشاء حساب
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;