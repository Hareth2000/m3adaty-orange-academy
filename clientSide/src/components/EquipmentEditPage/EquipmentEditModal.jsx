import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Save } from "lucide-react";

const EquipmentEditModal = ({ isOpen, onClose, equipmentId, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    if (isOpen && equipmentId) {
      fetchEquipment();
    }
  }, [isOpen, equipmentId]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/equipment/${equipmentId}`);
      const equipmentData = response.data;
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
    setLoading(true);
    setError("");
    try {
      // تحويل المميزات من نص إلى مصفوفة
      const featuresArray = formData.features
        ? formData.features.split(",").map(feature => feature.trim())
        : [];

      const dataToSend = {
        ...formData,
        features: featuresArray,
        dailyRate: Number(formData.dailyRate),
        weeklyRate: Number(formData.weeklyRate),
        monthlyRate: Number(formData.monthlyRate),
        year: Number(formData.year),
        minRentalDays: Number(formData.minRentalDays),
        depositAmount: Number(formData.depositAmount)
      };

      const response = await axios.put(
        `http://localhost:5000/api/equipment/${equipmentId}`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // تحديث البيانات في الوالد مباشرة
      if (onUpdate) {
        onUpdate({
          ...dataToSend,
          _id: equipmentId,
          features: featuresArray
        });
      }
      
      toast.success("تم تحديث المعدة بنجاح");
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "فشل في تحديث المعدة");
      toast.error(error.response?.data?.message || "فشل في تحديث المعدة");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">تعديل المعدة</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                عنوان المعدة
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                التصنيف
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                السعر اليومي (د.أ)
              </label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                السعر الأسبوعي (د.أ)
              </label>
              <input
                type="number"
                name="weeklyRate"
                value={formData.weeklyRate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                السعر الشهري (د.أ)
              </label>
              <input
                type="number"
                name="monthlyRate"
                value={formData.monthlyRate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الشركة المصنعة
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الموديل
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                سنة التصنيع
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الحالة
              </label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                المميزات (مفصولة بفاصلة)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الموقع
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                خيارات التوصيل
              </label>
              <input
                type="text"
                name="deliveryOptions"
                value={formData.deliveryOptions}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الحد الأدنى لأيام التأجير
              </label>
              <input
                type="number"
                name="minRentalDays"
                value={formData.minRentalDays}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                مبلغ الضمان (د.أ)
              </label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              المواصفات الفنية
            </label>
            <textarea
              name="technicalSpecs"
              value={formData.technicalSpecs}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              شروط التأجير
            </label>
            <textarea
              name="rentalTerms"
              value={formData.rentalTerms}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <label className="text-sm font-medium text-gray-700">
              متاحة للتأجير
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save size={18} />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentEditModal; 