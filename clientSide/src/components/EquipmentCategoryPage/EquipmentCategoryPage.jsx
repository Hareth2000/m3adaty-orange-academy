import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import {
  Heart,
  Menu,
  Search,
  X,
  DollarSign,
  Star,
  MapPin,
  Filter,
  Truck,
  Wrench,
  Tractor,
  Construction,
  Factory,
  Clock,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const EquipmentCategoryPage = () => {
  const [searchParams] = useSearchParams();
  const [equipment, setEquipment] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [favoriteEquipment, setFavoriteEquipment] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("newest");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // التصنيفات الجديدة مع المفاتيح
  const categories = {
    "الكل": "الكل",
    "heavy-machinery": "آليات ثقيلة",
    "industrial-tools": "عدد صناعية",
    "agricultural-tools": "عدد زراعية"
  };

  // أيقونات التصنيفات
  const categoryIcons = {
    "آليات ثقيلة": <Construction className="h-5 w-5 text-yellow-500" />,
    "عدد صناعية": <Factory className="h-5 w-5 text-yellow-500" />,
    "عدد زراعية": <Tractor className="h-5 w-5 text-yellow-500" />,
  };

  useEffect(() => {
    // قراءة الفئة من URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories[categoryFromUrl]) {
      setActiveCategory(categories[categoryFromUrl]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/equipment/all",
          {
            params: {
              page: currentPage,
              limit: 12,
              category: activeCategory !== "الكل" ? activeCategory : undefined,
              search: searchTerm || undefined,
              minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
              maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
              sortBy: sortBy,
            },
          }
        );
        setEquipment(response.data.data);
        setPagination(response.data.pagination);
        setLoading(false);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        setLoading(false);
      }
    };

    const getUserId = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/get-user",
          {
            withCredentials: true,
          }
        );
        setUserId(res.data.userId);
        fetchFavorites(res.data.userId);
      } catch (error) {
        console.error(
          "❌ خطأ في جلب بيانات المستخدم:",
          error.response?.data || error.message
        );
      }
    };

    const fetchFavorites = async (id) => {
      if (!id) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/favorites",
          { withCredentials: true }
        );

        const favorites = {};
        response.data.forEach((item) => {
          favorites[item._id] = true;
        });

        setFavoriteEquipment(favorites);
      } catch (error) {
        console.error("خطأ في جلب المفضلة:", error);
      }
    };

    fetchEquipment();
    getUserId();

    // تمرير لتأثير التحميل
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
  }, [currentPage, activeCategory, searchTerm, priceRange, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavorite = async (equipmentId) => {
    if (!userId) {
      alert("يرجى تسجيل الدخول لإضافة المعدات إلى المفضلة");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/toggle-favorite",
        { equipmentId },
        { withCredentials: true }
      );

      setFavoriteEquipment((prev) => ({
        ...prev,
        [equipmentId]: !prev[equipmentId],
      }));
    } catch (error) {
      console.error(
        "❌ خطأ في إضافة المعدات للمفضلة:",
        error.response?.data || error.message
      );
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // الحصول على أيقونة التصنيف
  const getCategoryIcon = (category) => {
    return (
      categoryIcons[category] || <Wrench className="h-5 w-5 text-yellow-500" />
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* رأس الصفحة مع التصنيفات */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                <Wrench className="h-6 w-6 text-yellow-500 ml-2" />
                <span>معدات للتأجير</span>
              </h1>
            </div>

            {/* Desktop Categories */}
            <div className="hidden md:flex space-x-reverse gap-x-6 lg:gap-x-10 justify-center flex-1">
              {Object.values(categories).map((category) => (
                <button
                  key={category}
                  className={`py-2 text-base font-medium transition-colors flex items-center ${
                    activeCategory === category
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-700 hover:text-yellow-500"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category !== "الكل" && (
                    <span className="ml-2">{getCategoryIcon(category)}</span>
                  )}
                  {category}
                </button>
              ))}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث هنا..."
                  className="rounded-md border border-gray-300 p-2 pr-10 w-36 lg:w-56 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                onClick={toggleFilters}
                className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 rounded-md text-gray-800 hover:bg-yellow-500/30 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>فلترة</span>
              </button>
            </div>

            {/* Mobile Menu & Search Toggles */}
            <div className="flex items-center space-x-reverse space-x-2 md:hidden">
              <button
                onClick={toggleMobileSearch}
                className="p-2 rounded-full bg-yellow-500/20 text-gray-800"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full bg-yellow-500/20 text-gray-800"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {mobileSearchOpen && (
            <div className="block md:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث هنا..."
                  className="rounded-md border border-gray-300 p-3 pr-10 w-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={toggleFilters}
                  className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 rounded-md text-gray-800"
                >
                  <Filter className="h-4 w-4" />
                  <span>فلترة</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Categories */}
          {mobileMenuOpen && (
            <div className="flex md:hidden overflow-x-auto pb-4 no-scrollbar">
              <div className="flex space-x-reverse gap-x-2 w-full">
                {Object.values(categories).map((category) => (
                  <button
                    key={category}
                    className={`py-2 px-3 text-sm whitespace-nowrap rounded-full transition-colors ${
                      activeCategory === category
                        ? "bg-yellow-500/10 text-yellow-500 font-bold"
                        : "bg-gray-100 text-gray-700 hover:bg-yellow-500/20"
                    }`}
                    onClick={() => {
                      setActiveCategory(category);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* بانر لكل تصنيف */}
      {activeCategory !== "الكل" && (
        <div className="relative bg-gray-100 py-10 lg:py-16 overflow-hidden">
          <div className="absolute inset-0">
            <svg
              className="absolute top-0 left-0 w-full opacity-20"
              viewBox="0 0 800 800"
            >
              <circle
                cx="400"
                cy="400"
                r="200"
                fill="none"
                stroke="yellow-500"
                strokeWidth="2"
                strokeDasharray="10,10"
              />
              <circle
                cx="400"
                cy="400"
                r="300"
                fill="none"
                stroke="yellow-500"
                strokeWidth="2"
                strokeDasharray="10,10"
              />
              <circle
                cx="400"
                cy="400"
                r="400"
                fill="none"
                stroke="yellow-500"
                strokeWidth="2"
                strokeDasharray="10,10"
              />
            </svg>
            <div className="absolute top-10 right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-white opacity-10 rounded-full"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div
              className={`flex items-center transition-all duration-700 transform ${
                isPageLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center ml-4 shadow-md">
                {getCategoryIcon(activeCategory)}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {activeCategory}
                </h2>
                <p className="text-gray-800/90 text-sm md:text-base">
                  استأجر أفضل {activeCategory} بأسعار تنافسية وجودة ممتازة
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {filtersOpen && (
        <div className="bg-gray-50 border-b border-gray-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 ml-1 text-yellow-500" />
                  نطاق السعر (JD)
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="الحد الأدنى"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(
                        parseInt(e.target.value) || 0,
                        priceRange[1]
                      )
                    }
                    className="w-24 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    min="0"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="الحد الأقصى"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(
                        priceRange[0],
                        parseInt(e.target.value) || 5000
                      )
                    }
                    className="w-24 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    min="0"
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Filter className="h-4 w-4 ml-1 text-yellow-500" />
                  ترتيب حسب
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      sortBy === "newest"
                        ? "bg-yellow-500 text-white"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-yellow-500/20 hover:border-yellow-500"
                    }`}
                    onClick={() => handleSortChange("newest")}
                  >
                    الأحدث
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      sortBy === "price_asc"
                        ? "bg-yellow-500 text-white"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-yellow-500/20 hover:border-yellow-500"
                    }`}
                    onClick={() => handleSortChange("price_asc")}
                  >
                    السعر: من الأقل للأعلى
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      sortBy === "price_desc"
                        ? "bg-yellow-500 text-white"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-yellow-500/20 hover:border-yellow-500"
                    }`}
                    onClick={() => handleSortChange("price_desc")}
                  >
                    السعر: من الأعلى للأقل
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      sortBy === "rating"
                        ? "bg-yellow-500 text-white"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-yellow-500/20 hover:border-yellow-500"
                    }`}
                    onClick={() => handleSortChange("rating")}
                  >
                    التقييم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Summary */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-gray-800">
              {pagination.totalItems || 0} معدة متوفرة
            </span>
            {searchTerm && (
              <span className="mr-2 text-gray-500">
                لنتائج البحث: "{searchTerm}"
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="ml-1 h-4 w-4" />
            <span>آخر تحديث: اليوم</span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">جارٍ تحميل المعدات...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 md:py-8">
          {equipment.filter(item => item.availability).length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity duration-500 ${
                isPageLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              {equipment.filter(item => item.availability).map((item, index) => (
                <div
                  key={item._id}
                  className={`flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1 duration-300`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-48 overflow-hidden group">
                    <Link to={`/equipment/${item._id}`}>
                      <img
                        src={`http://localhost:5000/${item.mainImage}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 m-2 rounded font-medium">
                      {item.condition}
                    </div>
                    <button
                      onClick={() => handleFavorite(item._id)}
                      className={`absolute top-0 left-0 p-2 m-2 rounded-full transition-all ${
                        favoriteEquipment[item._id]
                          ? "bg-red-500 text-white"
                          : "bg-white/80 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={
                          favoriteEquipment[item._id] ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/equipment/${item._id}`}>
                        <h2 className="text-lg font-bold text-gray-800 hover:text-yellow-500 transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-md">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="text-sm font-medium">
                          {item.averageRating || 4.5}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin size={14} className="ml-1" />
                      <span>{item.location}</span>
                    </div>

                    <div className="text-sm line-clamp-2 mb-3 text-gray-600">
                      {item.description}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="text-xs bg-yellow-500/10 px-2 py-1 rounded-full text-gray-800">
                        {item.manufacturer}
                      </span>
                      <span className="text-xs bg-yellow-500/10 px-2 py-1 rounded-full text-gray-800">
                        {item.model}
                      </span>
                      <span className="text-xs bg-yellow-500/10 px-2 py-1 rounded-full text-gray-800">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                      <span className="text-yellow-500 ml-1 font-bold">JD</span>
                      <span className="text-lg font-bold text-yellow-500">
                          {item.dailyRate}
                        </span>
                        <span className="text-gray-500 text-sm mr-1">
                          / يوم
                        </span>
                      </div>
                      <Link
                        to={`/equipment/${item._id}`}
                        className="px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-3">
                <Truck className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-lg text-gray-800 font-medium">
                لا توجد معدات متاحة
              </p>
              <p className="text-sm text-gray-500 mt-1">
                جرّب البحث بكلمات مختلفة أو تغيير التصنيف
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-sm p-2 inline-flex items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 mx-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 hover:bg-yellow-500/20"
            >
              <ArrowRight size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex">
              {Array.from({ length: pagination.totalPages }, (_, index) => {
                // Show limited page numbers with ellipsis
                if (
                  pagination.totalPages <= 5 ||
                  index === 0 ||
                  index === pagination.totalPages - 1 ||
                  (index >= currentPage - 2 && index <= currentPage)
                ) {
                  return (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-9 h-9 mx-1 flex items-center justify-center text-sm font-medium rounded-md transition-all ${
                        currentPage === index + 1
                          ? "bg-yellow-500 text-white"
                          : "bg-yellow-500/20 text-gray-800 hover:bg-yellow-500/30"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                } else if (
                  (index === 1 && currentPage > 3) ||
                  (index === pagination.totalPages - 2 &&
                    currentPage < pagination.totalPages - 2)
                ) {
                  return (
                    <span
                      key={index}
                      className="w-9 h-9 flex items-center justify-center"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              disabled={currentPage === pagination.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 mx-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 hover:bg-yellow-500/20"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Return to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-all"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default EquipmentCategoryPage;



