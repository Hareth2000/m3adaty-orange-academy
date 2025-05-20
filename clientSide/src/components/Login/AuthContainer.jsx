import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Registration";
import logo from "../../assets/images/swapkit-high-resolution-logo-removebg-preview.png";

const AuthContainer = () => {
  const [currentForm, setCurrentForm] = useState("login");

  const switchForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-tajawal">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden md:max-w-lg">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="swapKit Logo" className="w-36 h-auto" />
          </div>
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
