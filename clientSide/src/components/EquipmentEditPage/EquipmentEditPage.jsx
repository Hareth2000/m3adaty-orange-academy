import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Wrench,
  DollarSign,
  MapPin,
  Clock,
  Truck,
  Save,
  X,
} from "lucide-react";

const EquipmentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    manufacturer: "",
    model: "",
    year: "",
    condition: "",
    features: "",
    location: "",
    deliveryOptions: "",
    minRentalDays: "",
    depositAmount: "",
    technicalSpecs: "",
    rentalTerms: "",
    availability: true,
  });

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/equipment/${id}`);
      const equipmentData = response.data;
      setEquipment(equipmentData);
      setFormData({
        title: equipmentData.title || "",
        description: equipmentData.description || "",
        category: equipmentData.category || "",
        dailyRate: equipmentData.dailyRate || "",
        weeklyRate: equipmentData.weeklyRate || "",
        monthlyRate: equipmentData.monthlyRate || "",
        manufacturer: equipmentData.manufacturer || "",
        model: equipmentData.model || "",
        year: equipmentData.year || "",
        condition: equipmentData.condition || "",
        features: equipmentData.features?.join(", ") || "",
        location: equipmentData.location || "",
        deliveryOptions: equipmentData.deliveryOptions || "",
        minRentalDays: equipmentData.minRentalDays || "",
        depositAmount: equipmentData.depositAmount || "",
        technicalSpecs: equipmentData.technicalSpecs || "",
        rentalTerms: equipmentData.rentalTerms || "",
        availability: equipmentData.availability || true,
      });
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast.error("حدث خطأ أثناء جلب بيانات المعدة");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/equipment/${id}`,
        {
          ...formData,
          features: formData.features.split(",").map(f => f.trim()).filter(Boolean)
        },
        {
          withCredentials: true
        }
      );
      toast.success("تم تحديث المعدة بنجاح");
      // Get partner ID from the current URL
      const partnerId = window.location.pathname.split('/')[2];
      navigate(`/partner/${partnerId}`);
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تحديث المعدة");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-700">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-left" rtl={true} />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">تعديل المعدة</h1>
            <button
              onClick={() => navigate(`/equipment/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
              إلغاء
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان المعدة
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التصنيف
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر اليومي (د.أ)
                </label>
                <input
                  type="number"
                  name="dailyRate"
                  value={formData.dailyRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر الأسبوعي (د.أ)
                </label>
                <input
                  type="number"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر الشهري (د.أ)
                </label>
                <input
                  type="number"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الشركة المصنعة
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموديل
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  سنة التصنيع
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الحالة
                </label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المميزات (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموقع
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  خيارات التوصيل
                </label>
                <input
                  type="text"
                  name="deliveryOptions"
                  value={formData.deliveryOptions}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الحد الأدنى لأيام التأجير
                </label>
                <input
                  type="number"
                  name="minRentalDays"
                  value={formData.minRentalDays}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  مبلغ الضمان (د.أ)
                </label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المواصفات الفنية
              </label>
              <textarea
                name="technicalSpecs"
                value={formData.technicalSpecs}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شروط التأجير
              </label>
              <textarea
                name="rentalTerms"
                value={formData.rentalTerms}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  متاحة للتأجير
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/equipment/${id}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-2"
              >
                <Save size={18} />
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EquipmentEditPage; 