import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Registration";

const AuthContainer = () => {
  const [currentForm, setCurrentForm] = useState("login");

  const switchForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-[#2C2727]/5 p-4 font-tajawal">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left Side - Equipment Showcase */}
        <div className="hidden md:flex flex-col w-2/5 p-10 justify-between relative overflow-hidden bg-gradient-to-b from-yellow-100 to-[#2C2727]/5">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#2C2727"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Orange Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl -mr-32 -mt-32"></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-[#2C2727] mb-4">
              مرحباً بك في منصة تأجير المعدات الصناعية
            </h1>
            <p className="text-[#2C2727]/70 mb-8">
              المنصة الأولى لتأجير المعدات الصناعية والآليات بكفاءة عالية وأسعار
              تنافسية
            </p>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-xl ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-[#2C2727]">آليات ومعدات صناعية حديثة</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-xl ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-[#2C2727]">توصيل وتركيب سريع</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-xl ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-[#2C2727]">أسعار تنافسية وعروض خاصة</p>
            </div>
          </div>

          <div className="text-[#2C2727]/60 text-sm text-right relative z-10">
            © 2025 منصة تأجير المعدات. جميع الحقوق محفوظة.
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full md:w-3/5 p-8 md:p-12 rtl">
          <AnimatePresence mode="wait">
            {currentForm === "login" ? (
              <Login key="login" switchForm={() => switchForm("register")} />
            ) : (
              <Register key="register" switchForm={() => switchForm("login")} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
