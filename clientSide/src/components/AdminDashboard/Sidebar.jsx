import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderKanban,
  BadgeCheck,
  DollarSign,
  MailOpen,
  LogOut,
  Menu,
  X,
  Star,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { label: "الإحصائيات", path: "/admin-dashboard", icon: LayoutDashboard },
    { label: "المستخدمين", path: "/admin-dashboard/users", icon: Users },
    { label: "المعدات", path: "/admin-dashboard/equipment", icon: Package },
    { label: "الطلبات", path: "/admin-dashboard/orders", icon: FolderKanban },
    {
      label: "طلبات الشراكة",
      path: "/admin-dashboard/partners",
      icon: BadgeCheck,
    },
    { label: "التقييمات", path: "/admin-dashboard/testimonials", icon: Star },
    { label: "المدفوعات", path: "/admin-dashboard/payments", icon: DollarSign },
    { label: "الرسائل", path: "/admin-dashboard/messages", icon: MailOpen },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("تم تسجيل الخروج بنجاح");
      window.location.href = "/Auth";
    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white md:hidden"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Using transform for mobile and fixed position */}
      <aside
        className={`w-72 bg-white shadow-lg h-screen p-6 space-y-6 border-l border-gray-200 fixed top-0 right-0 z-40
                   transition-transform duration-300 ease-in-out md:translate-x-0
                   ${
                     isMobileMenuOpen
                       ? "translate-x-0"
                       : "translate-x-full md:translate-x-0"
                   }`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            لوحة التحكم
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <nav className="flex flex-col gap-3">
          {links.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 ${
                pathname === path
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-yellow-50"
              }`}
            >
              <Icon
                size={20}
                className={pathname === path ? "text-white" : "text-yellow-600"}
              />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="pt-6 mt-auto border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                       text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} className="text-red-600" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Spacer div to push content for desktop */}
      <div className="w-72 flex-shrink-0 hidden md:block"></div>
    </>
  );
};

export default Sidebar;
