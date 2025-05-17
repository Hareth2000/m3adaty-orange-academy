// src/components/AdminDashboard/AdminDashboard.jsx
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Sidebar positioned on the right */}
      <Sidebar />
      
      {/* Main content area with proper RTL spacing */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">مرحباً بك في لوحة التحكم</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;