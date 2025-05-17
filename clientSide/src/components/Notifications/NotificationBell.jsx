import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // Debug: Print notifications to console
    // This will print after every render, so you can see the structure
    // Remove after debugging
    // eslint-disable-next-line
    console.log("Notifications:", notifications);
    // إغلاق القائمة عند الضغط خارجها
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Debug: Print notifications to console whenever they change
    console.log("Notifications:", notifications);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", { withCredentials: true });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/mark-read/${id}`, {}, { withCredentials: true });
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => prev - 1);
    } catch (err) {}
  };

  const handlePaymentClick = (rentalId, price) => {
    if (price) {
      navigate(`/payment/${rentalId}?price=${price}`);
    } else {
      navigate(`/payment/${rentalId}`);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        className="relative p-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-label="الإشعارات"
      >
        <Bell className="w-5 h-5 text-yellow-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 font-bold text-gray-700 flex items-center justify-between">
            الإشعارات
            <button
              className="text-xs text-yellow-500 hover:underline"
              onClick={() => {
                notifications.forEach((n) => {
                  if (!n.isRead) markAsRead(n._id);
                });
              }}
            >
              تعليم الكل كمقروء
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">لا توجد إشعارات</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 cursor-pointer hover:bg-yellow-50 transition-all ${!n.isRead ? "bg-yellow-50/50" : ""}`}
                  onClick={() => markAsRead(n._id)}
                >
                  <div className="font-medium text-gray-800 mb-1">{n.title}</div>
                  <div className="text-sm text-gray-600 mb-1">{n.message}</div>
                  {/* زر خاص فقط لإشعارات طلبات التأجير المقبولة */}
                  {n.type === "rental_accepted" && n.rental && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile?tab=rentals&highlight=${n.rental}`);
                        setOpen(false);
                      }}
                      className="mt-2 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                        <path d="M12 19v2" />
                      </svg>
                      عرض طلب التأجير
                    </button>
                  )}
                  <div className="text-xs text-gray-400 text-left">{new Date(n.createdAt).toLocaleString("ar-EG")}</div>
                </div>
              ))
            )}
          </div>
    
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 