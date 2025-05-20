import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Menu,
  X,
  LogOut,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import NotificationBell from "../Notifications/NotificationBell";
import logo from "../../assets/images/swapkit-high-resolution-logo-removebg-preview.png";

const publicPages = [
  { name: "الرئيسية", href: "/" },
  { name: "المعدات", href: "/categories" },
  
  { name: "من نحن", href: "/about" },
  { name: "تواصل معنا", href: "/contact" },
];

const customerPages = [
  { name: "الرئيسية", href: "/" },
  { name: "المعدات", href: "/categories" },
  { name: "من نحن", href: "/about" },
  { name: "تواصل معنا", href: "/contact" },
];

const partnerPages = [
  { name: "الرئيسية", href: "/" },
  { name: "ملف الشريك", href: "/partner/profile" },
  { name: "إنشاء معدات", href: "/create-equipment" },
  { name: "من نحن", href: "/about" },
  { name: "تواصل معنا", href: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/get-role",
          { withCredentials: true }
        );
        if (response.data.role) {
          setUserRole(response.data.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    fetchUserRole();

    if (isHomePage) {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [isHomePage]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUserRole(null);
      navigate("/");
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const getNavigationLinks = () => {
    if (!isAuthenticated) return publicPages;
    if (userRole === "customer") return customerPages;
    if (userRole === "partner") return partnerPages;
    return publicPages;
  };

  const textColor = isHomePage && !isScrolled ? "text-white" : "text-gray-800";
  const hoverBg =
    isHomePage && !isScrolled ? "hover:bg-white/10" : "hover:bg-gray-100";
  const iconColor = isHomePage && !isScrolled ? "text-white" : "text-gray-600";

  return (
    <>
      <nav
        className={`${
          isHomePage ? "fixed" : "sticky"
        } top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHomePage && !isScrolled ? "bg-transparent" : "bg-white shadow-md"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="flex items-center">
                  <div className="w-35 h-40">
                    <img src={logo} alt="swapKit Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-6">
              <div className="flex items-center justify-between w-full max-w-xl">
                {getNavigationLinks().map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative group mx-2"
                  >
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${textColor} hover:text-yellow-500`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`absolute -bottom-1 right-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                        location.pathname === item.href ? "scale-x-100" : ""
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 space-x-reverse">
              {/* Notification Bell */}
              <NotificationBell />
              {/* Auth Button */}
              {!isAuthenticated ? (
                <Link to="/Auth">
                  <button className="bg-yellow-500 text-white text-xs sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium mr-1 sm:mr-2">
                    تسجيل الدخول
                  </button>
                </Link>
              ) : (
                <div className="flex items-center space-x-0.5 sm:space-x-1 space-x-reverse">
                  <Link
                    to="/profile"
                    className={`p-1 sm:p-1.5 rounded-lg transition-colors duration-300 ${iconColor} ${hoverBg}`}
                    aria-label="الملف الشخصي"
                  >
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-1 sm:p-1.5 rounded-lg transition-colors duration-300 ${iconColor} ${hoverBg}`}
                    aria-label="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden p-1 sm:p-1.5 rounded-lg transition-colors duration-300 mr-1 ${iconColor} ${hoverBg}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden"
              >
                <div className="bg-white border-t border-gray-100 px-2 py-1 space-y-0.5 shadow-lg rounded-b-lg">
                  {getNavigationLinks().map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-gray-700 hover:text-yellow-500 text-xs font-medium hover:bg-gray-50 ${
                        location.pathname === item.href
                          ? "bg-gray-50 text-yellow-500"
                          : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-right px-3 py-2 text-red-600 hover:text-red-700 rounded-md text-xs font-medium hover:bg-gray-50"
                    >
                      تسجيل الخروج
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* إضافة مساحة فارغة بحجم الشريط العلوي في الصفحات غير الرئيسية */}
      {!isHomePage && <div className="h-14 sm:h-16"></div>}
    </>
  );
};

export default Navbar;
