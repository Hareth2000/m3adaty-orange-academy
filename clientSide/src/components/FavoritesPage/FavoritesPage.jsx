import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Filter,
  MapPin,
  Trash2,
  Heart,
  ChevronDown,
  X,
  DollarSign,
  Calendar,
  Eye,
  Star,
  Share2,
  Bell,
  Truck,
  Wrench,
  Construction,
  Factory,
  Tractor,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FavoritesPage = () => {
  // State for view toggle (grid/list)
  const [viewMode, setViewMode] = useState("grid");
  // State for animations
  const [isLoaded, setIsLoaded] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // تحديث التصنيفات للتوافق مع النظام الجديد
  const categories = [
    { id: "all", name: "الكل", icon: <Wrench size={14} /> },
    {
      id: "آليات ثقيلة",
      name: "آليات ثقيلة",
      icon: <Construction size={14} />,
    },
    { id: "عدد صناعية", name: "عدد صناعية", icon: <Factory size={14} /> },
    { id: "عدد زراعية", name: "عدد زراعية", icon: <Tractor size={14} /> },
  ];

  // State for active category
  const [activeCategory, setActiveCategory] = useState("all");

  // مدن الأردن للفلترة
  const jordanCities = [
    "عمان",
    "إربد",
    "الزرقاء",
    "العقبة",
    "المفرق",
    "جرش",
    "عجلون",
    "مادبا",
    "الكرك",
    "الطفيلة",
    "معان",
    "السلط",
    "وادي الأردن",
  ];

  // حالة للمدينة المختارة
  const [selectedCity, setSelectedCity] = useState("");

  // Set animation on load
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Function to remove favorite
  const removeFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.post(
        "http://localhost:5000/api/users/toggle-favorite",
        { equipmentId: id },
        { withCredentials: true }
      );

      setFavorites(favorites.filter((item) => item._id !== id));
      toast.success("تمت إزالة المعدات من المفضلة");

      // تحديث حالة وجود المفضلة
      if (favorites.length <= 1) {
        setHasFavorites(false);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إزالة المعدات من المفضلة");
      console.error(error);
    }
  };

  // Sample card click handler
  const handleCardClick = (id) => {
    window.location.href = `/equipment/${id}`;
  };

  // Get condition color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "جديدة":
        return "bg-green-100 text-green-800 border-green-200";
      case "ممتازة":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "جيدة جداً":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "جيدة":
        return "bg-[#FF7517]/10 text-[#FF7517] border-[#FF7517]/20";
      case "مستعملة":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "كالجديدة":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Load user data and favorites
  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/get-user",
          {
            withCredentials: true,
          }
        );
        console.log("✅ تم استلام معرف المستخدم:", res.data.userId);
      } catch (error) {
        console.error(
          "❌ خطأ في جلب بيانات المستخدم:",
          error.response?.data || error.message
        );
      }
    };

    const getFavorites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/favorites",
          { withCredentials: true }
        );
        const favoriteItems = response.data || [];
        console.log(favoriteItems);
        setFavorites(favoriteItems);
        setHasFavorites(favoriteItems.length > 0);

        // حساب عدد الصفحات عند استلام البيانات
        setTotalPages(Math.ceil(favoriteItems.length / itemsPerPage));
      } catch (error) {
        console.error("خطأ في جلب المفضلة:", error);
      }
    };

    getUserId();
    getFavorites();
  }, [itemsPerPage]);

  // Handle price range change
  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    setCurrentPage(1); // إعادة التعيين للصفحة الأولى عند تغيير الفلتر
  };

  // Handle city change
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentPage(1); // إعادة التعيين للصفحة الأولى عند تغيير الفلتر
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter by category, price range, and city
  const filteredFavorites = favorites.filter((item) => {
    // Filter by category
    if (activeCategory !== "all" && item.category !== activeCategory) {
      return false;
    }
    // Filter by price range
    if (item.dailyRate < priceRange[0] || item.dailyRate > priceRange[1]) {
      return false;
    }
    // Filter by city
    if (selectedCity && item.location !== selectedCity) {
      return false;
    }
    return true;
  });

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.dailyRate - b.dailyRate;
      case "price_desc":
        return b.dailyRate - a.dailyRate;
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Calculate total pages
  useEffect(() => {
    setTotalPages(Math.ceil(filteredFavorites.length / itemsPerPage));
  }, [filteredFavorites, itemsPerPage]);

  // Get current page items
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedFavorites.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Current items to display
  const currentItems = getCurrentItems();

  // Tooltip component
  const Tooltip = ({ children, text }) => (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 px-2 py-1 bg-yellow-500 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-10 shadow-lg shadow-yellow-500/20">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-yellow-500"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12" dir="rtl">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        rtl={true}
      />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10 transition-all duration-300 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-col space-y-6">
            {/* Top section with logo and view toggle */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <div className="ml-3 w-10 h-10 rounded-lg bg-yellow-500 text-white flex items-center justify-center shadow-md">
                  <Heart size={20} />
                </div>
                <span className="relative">
                  المعدات المفضلة
                  <span className="absolute -bottom-1 right-0 w-full h-1 bg-yellow-200 rounded-full"></span>
                </span>
              </h1>
              <div className="flex space-x-3 space-x-reverse self-end sm:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md border transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
                      : "bg-white text-gray-800 border-gray-200 hover:border-yellow-500 hover:text-yellow-500"
                  }`}
                >
                  <LayoutGrid size={18} />
                  <span className="inline-block font-medium">شبكة</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md border transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
                      : "bg-white text-gray-800 border-gray-200 hover:border-yellow-500 hover:text-yellow-500"
                  }`}
                >
                  <List size={18} />
                  <span className="inline-block font-medium">قائمة</span>
                </button>
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md border transition-all duration-300 ${
                    isFiltersOpen
                      ? "bg-gray-800 text-white border-gray-800 shadow-md"
                      : "bg-white text-gray-800 border-gray-200 hover:border-gray-800 hover:text-gray-800"
                  }`}
                >
                  <Filter size={18} />
                  <span className="inline-block font-medium">فلترة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  نطاق السعر (دينار/يوم)
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="الحد الأدنى"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(
                        parseInt(e.target.value) || 0,
                        priceRange[1]
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="الحد الأقصى"
                    min="0"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(
                        priceRange[0],
                        parseInt(e.target.value) || 5000
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  المدينة
                </h3>
                <div className="relative">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-10"
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                  >
                    <option value="">جميع المدن</option>
                    {jordanCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  ترتيب حسب
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`px-3 py-2 rounded-md text-sm ${
                      sortBy === "newest"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    الأحدث
                  </button>
                  <button
                    onClick={() => setSortBy("price_asc")}
                    className={`px-3 py-2 rounded-md text-sm ${
                      sortBy === "price_asc"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    السعر: من الأقل للأعلى
                  </button>
                  <button
                    onClick={() => setSortBy("price_desc")}
                    className={`px-3 py-2 rounded-md text-sm ${
                      sortBy === "price_desc"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    السعر: من الأعلى للأقل
                  </button>
                  <button
                    onClick={() => setSortBy("rating")}
                    className={`px-3 py-2 rounded-md text-sm ${
                      sortBy === "rating"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    التقييم
                  </button>
                </div>
              </div>
            </div>

            {/* عرض الفلاتر النشطة */}
            {(selectedCity || priceRange[0] > 0 || priceRange[1] < 5000) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700">
                    الفلاتر النشطة:
                  </span>

                  {selectedCity && (
                    <div className="bg-yellow-100 text-yellow-500 px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="ml-1">المدينة: {selectedCity}</span>
                      <button
                        onClick={() => setSelectedCity("")}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <div className="bg-yellow-100 text-yellow-500 px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="ml-1">
                        السعر: {priceRange[0]} - {priceRange[1]} دينار
                      </span>
                      <button
                        onClick={() => setPriceRange([0, 5000])}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedCity("");
                      setPriceRange([0, 5000]);
                      setSortBy("newest");
                    }}
                    className="text-yellow-500 hover:text-yellow-600 text-sm font-medium"
                  >
                    مسح الكل
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-4">
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setCurrentPage(1); // إعادة التعيين للصفحة الأولى عند تغيير التصنيف
              }}
              className={`flex items-center space-x-1 space-x-reverse px-4 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white text-gray-800 border border-gray-200 hover:border-yellow-500 hover:text-yellow-500"
              }`}
            >
              <span className="ml-1">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {hasFavorites && currentItems.length > 0 ? (
          <div
            className={`
              ${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col space-y-6"
              }
              opacity-0 transform translate-y-8 transition-all duration-1000 ease-out
              ${isLoaded ? "opacity-100 translate-y-0" : ""}
            `}
          >
            {currentItems.map((item, index) => (
              <div
                key={item._id}
                onClick={() => handleCardClick(item._id)}
                className={`
                  group bg-white rounded-lg overflow-hidden transition-all duration-500 cursor-pointer
                  ${viewMode === "list" ? "flex" : "flex flex-col"}
                  opacity-0 transform translate-y-8
                  ${isLoaded ? "opacity-100 translate-y-0" : ""}
                  border border-gray-200 hover:border-yellow-500
                  shadow-sm hover:shadow-md
                  relative
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Equipment Image */}
                <div
                  className={`
                  relative overflow-hidden
                  ${viewMode === "list" ? "w-48 md:w-64" : "h-48"}
                `}
                >
                  <img
                    src={`http://localhost:5000/${item.mainImage}`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Condition badge */}
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getConditionColor(
                      item.condition
                    )}`}
                  >
                    {item.condition || "جيدة"}
                  </div>
                  {/* Remove from favorites button */}
                  <button
                    onClick={(e) => removeFavorite(item._id, e)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Heart fill="currentColor" size={16} />
                  </button>
                </div>

                {/* Equipment Content */}
                <div className="p-4 flex-grow flex flex-col">
                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-yellow-500 transition-colors">
                    {item.title}
                  </h2>

                  {/* Manufacturer and model */}
                  <div className="flex items-center text-sm mb-3 text-gray-800/80">
                    <Wrench size={14} className="ml-1.5 text-yellow-500" />
                    <span className="mr-1">
                      {item.manufacturer} {item.model} - {item.year}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm mb-3 text-gray-800/80">
                    <MapPin size={14} className="ml-1.5 text-yellow-500" />
                    <span className="mr-1">
                      {item.location || "عمان، الأردن"}
                    </span>
                  </div>

                  {/* Features - only show in list view */}
                  {viewMode === "list" && item.features && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-800/80 line-clamp-2">
                        {item.features.join("، ")}
                      </p>
                    </div>
                  )}

                  {/* Rating and Price */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <Star
                        size={16}
                        className="ml-1 text-yellow-500 fill-yellow-500"
                      />
                      <span className="text-gray-800/80 font-medium">
                        {item.averageRating || "4.5"}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-500 font-bold">
                      <DollarSign size={16} className="ml-1" />
                      <span>{item.dailyRate}</span>
                      <span className="text-xs text-gray-800/60 mr-1">/ يوم</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center transition-all duration-700 transform opacity-0 translate-y-8 animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-yellow-100 flex items-center justify-center transform hover:rotate-6 transition-all duration-700 hover:scale-110 group">
              <Heart
                size={36}
                className="text-yellow-500 transition-all duration-700 group-hover:scale-110"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <span className="relative inline-block">
                لا توجد معدات في المفضلة
                <span className="absolute -bottom-1 right-0 w-full h-1 bg-yellow-200 rounded-full"></span>
              </span>
            </h2>
            <p className="text-gray-800/80 max-w-lg mx-auto mb-8">
              قم بإضافة معدات إلى المفضلة لمتابعتها ومقارنتها لاحقًا. يمكنك
              النقر على أيقونة القلب في صفحة المعدات لإضافتها إلى المفضلة.
            </p>
            <Link
              to="/equipment"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md transition-colors font-medium"
            >
              استعرض المعدات المتاحة
            </Link>

            <div className="max-w-2xl mx-auto mt-16">
              <h3 className="text-xl font-bold mb-6 text-gray-800 relative inline-block">
                معدات مقترحة لك
                <span className="absolute -bottom-1 right-0 w-full h-0.5 bg-yellow-300 rounded-full"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:border-yellow-500 group"
                  >
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={`/api/placeholder/300/200?text=معدات${item}`}
                        alt="معدات مقترحة"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                        جديدة
                      </div>
                      <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-800/60 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors">
                        <Heart size={16} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-2 group-hover:text-yellow-500 transition-colors">
                        حفارة هيدروليكية كاتربيلر {320 + item}
                      </h4>
                      <div className="flex items-center text-sm mb-2 text-gray-800/80">
                        <MapPin size={14} className="ml-1.5 text-yellow-500" />
                        <span className="mr-1">عمان، الأردن</span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <Star
                            size={16}
                            className="ml-1 text-yellow-500 fill-yellow-500"
                          />
                          <span className="text-gray-800/80 font-medium">
                            4.{7 + item}
                          </span>
                        </div>
                        <div className="flex items-center text-yellow-500 font-bold">
                          <span>{150 + item * 25}</span>
                          <span className="text-xs text-gray-800/60 mr-1">
                            / يوم
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No matches found */}
        {hasFavorites &&
          sortedFavorites.length > 0 &&
          currentItems.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Filter size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                لا توجد نتائج تطابق الفلتر
              </h3>
              <p className="text-gray-600 mb-4">
                يرجى تعديل معايير البحث أو إعادة ضبط الفلتر للعثور على المعدات
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setPriceRange([0, 5000]);
                  setSortBy("newest");
                  setSelectedCity("");
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                إعادة ضبط الفلتر
              </button>
            </div>
          )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2 space-x-reverse">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>

            {/* Page Buttons */}
            <div className="flex space-x-2 space-x-reverse">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show current page, first page, last page, and one page before and after current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    page === currentPage ||
                    page === currentPage - 1 ||
                    page === currentPage + 1
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md ${
                          page === currentPage
                            ? "bg-yellow-500 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <div
                        key={page}
                        className="flex items-center justify-center w-10 h-10"
                      >
                        ...
                      </div>
                    );
                  }

                  return null;
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
