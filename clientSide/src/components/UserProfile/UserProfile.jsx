import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  MapPin,
  Phone,
  LogOut,
  Edit,
  Heart,
  Star,
  Truck,
  Clock,
  Settings,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // قائمة المفضلة
  const [favorites, setFavorites] = useState([]);

  // تفعيل التبويبات
  const [activeTab, setActiveTab] = useState("profile");

  // بيانات المستخدم التي يمكن تعديلها
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: null,
  });

  // إعداد الإشعارات: افترضنا خيارين (بريد إلكتروني + إشعارات التطبيق)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  const [rentals, setRentals] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightRentalId = params.get("highlight");

  useEffect(() => {
    // جلب بيانات المستخدم
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        // تعبئة الحقول
        setUpdatedUser({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phoneNumber || "",
          address: res.data.user.address || "",
          profilePicture: res.data.user.profilePicture,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "فشل في جلب بيانات المستخدم"
        );
      } finally {
        setLoading(false);
      }
    };

    // جلب المفضلة
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/favorites",
          {
            withCredentials: true,
          }
        );
        setFavorites(res.data);
      } catch (error) {
        console.error("خطأ في جلب المفضلة:", error);
      }
    };

    // جلب طلبات التأجير
    const fetchRentals = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/rentals/my-rentals",
          { withCredentials: true }
        );
        setRentals(res.data);
      } catch (error) {
        console.error("خطأ في جلب طلبات التأجير:", error.response || error);
      }
    };

    // تفعيل تبويب طلبات التأجير إذا كان في الكويري باراميتر
    if (params.get("tab") === "rentals") {
      setActiveTab("rentals");
    }

    fetchUserProfile();
    fetchFavorites();
    fetchRentals();
  }, [location.search, isEditing]);

  // تحديث حقول الإدخال في الحالة
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // تغيير ملف الصورة الشخصية
  const handleFileChange = (e) => {
    setUpdatedUser((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  // حفظ التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updatedUser.name);
    formData.append("email", updatedUser.email);
    formData.append("phoneNumber", updatedUser.phone);
    formData.append("address", updatedUser.address);

    // أضف الصورة فقط إذا تم رفع صورة جديدة
    if (
      updatedUser.profilePicture &&
      updatedUser.profilePicture instanceof File
    ) {
      formData.append("profilePicture", updatedUser.profilePicture);
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      // تحديث البيانات في الحالة
      const updatedUserData = {
        ...res.data.user,
        profilePicture: res.data.user.profilePicture || user.profilePicture // احتفظ بالصورة القديمة إذا لم يتم تحديثها
      };
      
      setUser(updatedUserData);
      setUpdatedUser({
        name: updatedUserData.name,
        email: updatedUserData.email,
        phone: updatedUserData.phoneNumber || "",
        address: updatedUserData.address || "",
        profilePicture: updatedUserData.profilePicture,
      });
      
      setIsEditing(false);
      toast.success("تم تحديث المعلومات بنجاح");
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في تحديث المعلومات");
    }
  };

  // إزالة معدة من المفضلة
  const handleRemoveFavorite = async (equipmentId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/toggle-favorite",
        { equipmentId },
        { withCredentials: true }
      );
      setFavorites(favorites.filter((item) => item._id !== equipmentId));
      toast.success("تمت إزالة المعدات من المفضلة");
    } catch (error) {
      toast.error("فشل في إزالة المعدات من المفضلة");
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "/auth";
    } catch (error) {
      toast.error("فشل في تسجيل الخروج");
    }
  };

  // حذف الحساب
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "هل أنت متأكد أنك تريد حذف حسابك نهائيًا؟ لا يمكن التراجع."
      )
    ) {
      return;
    }
    try {
      await axios.delete("http://localhost:5000/api/users/delete", {
        withCredentials: true,
      });
      toast.success("تم حذف الحساب بنجاح.");
      // إعادة توجيه أو تحديث الصفحة
      window.location.href = "/auth"; // أو إلى صفحة رئيسية
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في حذف الحساب");
    }
  };

  // تحكم في تحميل الصفحة
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-700">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-yellow-500"
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
          جاري التحميل...
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* الهيدر */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg px-6 py-8">
            <div className="flex flex-col md:flex-row items-center">
              {console.log('Profile Picture:', user.profilePicture)}
              {user.profilePicture ? (
                <div>
                  <img
                    src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`}
                    alt="الصورة الشخصية"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
                    onError={(e) => {
                      console.log('Image Error:', e);
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.parentElement.innerHTML = `
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md">
                          <svg class="h-16 w-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md">
                  <User className="h-16 w-16 text-yellow-500" />
                </div>
              )}
              <div className="mt-4 md:mt-0 md:mr-6 text-center md:text-right flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {user.name}
                </h1>
                <p className="text-white">{user.email}</p>
                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="inline-flex items-center px-4 py-2 bg-white/25 backdrop-blur-sm text-white rounded-lg text-sm font-medium shadow-sm border border-white/20 hover:bg-white/30 transition duration-200">
                    <Star className="ml-2 h-5 w-5 text-white" />
                    زبون عادي
                  </span>
                  {/* رقم الهاتف */}
                  {user.phoneNumber && (
                    <span className="inline-flex items-center px-4 py-2 bg-white/25 backdrop-blur-sm text-white rounded-lg text-sm font-medium shadow-sm border border-white/20 hover:bg-white/30 transition duration-200">
                      <Phone className="ml-2 h-5 w-5 text-white" />
                      {user.phoneNumber}
                    </span>
                  )}
                  {/* العنوان */}
                  {user.address && (
                    <span className="inline-flex items-center px-4 py-2 bg-white/25 backdrop-blur-sm text-white rounded-lg text-sm font-medium shadow-sm border border-white/20 hover:bg-white/30 transition duration-200">
                      <MapPin className="ml-2 h-5 w-5 text-white" />
                      {user.address}
                    </span>
                  )}
                </div>
              </div>
              {/* زر تسجيل الخروج */}
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-white text-yellow-500 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 ml-2" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* تبويبات الملاحة */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-3">
          <div className="flex flex-wrap overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === "profile"
                  ? "bg-yellow-500/10 text-yellow-500 font-semibold"
                  : "text-[#2C2727] hover:bg-gray-50 hover:text-yellow-500"
              }`}
            >
              <User
                className={`h-5 w-5 ml-2 ${
                  activeTab === "profile" ? "text-yellow-500" : "text-[#2C2727]"
                }`}
              />
              <span>الملف الشخصي</span>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === "favorites"
                  ? "bg-yellow-500/10 text-yellow-500 font-semibold"
                  : "text-[#2C2727] hover:bg-gray-50 hover:text-yellow-500"
              }`}
            >
              <Heart
                className={`h-5 w-5 ml-2 ${
                  activeTab === "favorites"
                    ? "text-yellow-500"
                    : "text-[#2C2727]"
                }`}
              />
              <span>المفضلة</span>
              <span className="mr-1 bg-yellow-500/10 text-[#2C2727] px-2 py-0.5 rounded-full text-xs font-medium">
                {favorites.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === "rentals"
                  ? "bg-yellow-500/10 text-yellow-500 font-semibold"
                  : "text-[#2C2727] hover:bg-gray-50 hover:text-yellow-500"
              }`}
            >
              <Clock
                className={`h-5 w-5 ml-2 ${
                  activeTab === "rentals" ? "text-yellow-500" : "text-[#2C2727]"
                }`}
              />
              <span>طلبات التأجير</span>
              <span className="mr-1 bg-yellow-500/10 text-[#2C2727] px-2 py-0.5 rounded-full text-xs font-medium">
                {rentals.length}
              </span>
            </button>
            {user && user.role === "customer" && (
              <Link
                to="/register-partner"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ml-2"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Truck className="h-5 w-5" />
                تسجيل كشريك
              </Link>
            )}
          </div>
        </div>

        {/* محتوى التبويبات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* التبويب الأول: الملف الشخصي */}
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#2C2727]">
                  المعلومات الشخصية
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  <Edit className="h-4 w-4 ml-1" />
                  {isEditing ? "إلغاء" : "تعديل المعلومات"}
                </button>
              </div>

              {isEditing ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  encType="multipart/form-data"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-[#2C2727]/70 block mb-1">
                        الاسم
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={updatedUser.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#2C2727]/70 block mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={updatedUser.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#2C2727]/70 block mb-1">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={updatedUser.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="+962 7X XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#2C2727]/70 block mb-1">
                        العنوان
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={updatedUser.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="المدينة، المنطقة"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-[#2C2727]/70 block mb-1">
                        الصورة الشخصية
                      </label>
                      <input
                        type="file"
                        name="profilePicture"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      حفظ التغييرات
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-[#2C2727]/70">الاسم</label>
                    <p className="font-medium text-[#2C2727]">{user.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-[#2C2727]/70">
                      البريد الإلكتروني
                    </label>
                    <p className="font-medium text-[#2C2727]">{user.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-[#2C2727]/70">
                      رقم الهاتف
                    </label>
                    <p className="font-medium text-[#2C2727]">
                      {user.phoneNumber || "غير محدد"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-[#2C2727]/70">العنوان</label>
                    <p className="font-medium text-[#2C2727]">
                      {user.address || "غير محدد"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-[#2C2727]/70">
                      تاريخ الانضمام
                    </label>
                    <p className="font-medium text-[#2C2727]">
                      {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* التبويب الثاني: المفضلة */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-xl font-semibold text-[#2C2727] mb-6">
                المعدات المفضلة
              </h2>
              {favorites.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Heart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-2">لا توجد معدات مفضلة</p>
                  <p className="text-gray-500 text-sm">
                    يمكنك إضافة المعدات إلى المفضلة بالضغط على زر القلب
                  </p>
                  <Link
                    to="/equipment"
                    className="inline-block mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    استعرض المعدات المتاحة
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={`http://localhost:5000/${item.mainImage}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 m-2 rounded">
                          {item.condition}
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(item._id)}
                          className="absolute top-0 left-0 p-2 m-2 rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Heart className="h-5 w-5" fill="currentColor" />
                        </button>
                      </div>
                      <div className="p-4">
                        <Link to={`/equipment/${item._id}`}>
                          <h3 className="font-bold text-lg mb-2 hover:text-yellow-500 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Truck className="h-4 w-4 ml-1 text-yellow-500" />
                          <span>
                            {item.manufacturer} {item.model}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 ml-1 text-yellow-500" />
                            <span className="text-sm">{item.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">
                              {item.averageRating || "4.5"}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-yellow-500 font-bold">
                            {item.dailyRate} دينار
                            <span className="text-xs text-gray-500 mr-1">
                              / يوم
                            </span>
                          </div>
                          <Link
                            to={`/equipment/${item._id}`}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                          >
                            عرض التفاصيل
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* تبويب طلبات التأجير مع التعديل المطلوب */}
          {activeTab === "rentals" && (
            <div>
              <h2 className="text-xl font-semibold text-[#2C2727] mb-6">
                طلبات التأجير
              </h2>
              {rentals.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-2">لا توجد طلبات تأجير</p>
                  <p className="text-gray-500 text-sm">
                    لم تقم بتقديم أي طلبات تأجير بعد
                  </p>
                  <Link
                    to="/equipment"
                    className="inline-block mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    استعرض المعدات المتاحة
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {rentals.map((rental) => (
                    <div
                      key={rental._id}
                      className={`bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between${highlightRentalId === rental._id ? " ring-2 ring-blue-500 bg-blue-50" : ""}`}
                    >
                      <div className="flex items-center space-x-4 ml-4">
                        <img
                          src={`http://localhost:5000/${rental.equipment?.mainImage}`}
                          alt={rental.equipment?.title}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg text-[#2C2727]">
                            {rental.equipment?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {rental.equipment?.manufacturer}{" "}
                            {rental.equipment?.model}
                          </p>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4 ml-1" />
                            <span>
                              {new Date(rental.startDate).toLocaleDateString(
                                "ar-EG"
                              )}{" "}
                              -{" "}
                              {new Date(rental.endDate).toLocaleDateString(
                                "ar-EG"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            rental.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : rental.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : rental.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rental.status === "accepted" && "مقبول"}
                          {rental.status === "pending" && "قيد المراجعة"}
                          {rental.status === "rejected" && "مرفوض"}
                          {rental.status === "completed" && "مكتمل"}
                        </span>

                        <div className="mt-2 flex flex-col space-y-2">
                          <Link
                            to={`/equipment/${rental.equipment?._id}`}
                            className="text-yellow-500 hover:text-yellow-600 text-sm"
                          >
                            عرض المعدة
                          </Link>

                          {/* زر الدفع يظهر فقط إذا كانت الحالة مقبول، وإذا كانت مدفوعة يظهر زر معطل */}
                          {rental.status === "accepted" && (
                            <Link
                              to={`/payment/${rental._id}?price=${rental.price}`}
                              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                            >
                              <CreditCard className="ml-1 h-4 w-4" />
                              الدفع الآن
                            </Link>
                          )}
                          {rental.status === "paid" && (
                            <button
                              disabled
                              className="flex items-center justify-center bg-gray-400 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed"
                            >
                              <CreditCard className="ml-1 h-4 w-4" />
                              تم الدفع
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer rtl={true} />
    </div>
  );
};

export default UserProfile;
