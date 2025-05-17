import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Search, Star, Check, X, Filter, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/testimonials/all", {
        withCredentials: true,
      });
      setTestimonials(res.data);
    } catch (err) {
      console.error("Error fetching testimonials", err);
      toast.error("فشل في تحميل التقييمات");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await Swal.fire({
      title: 'تأكيد التغيير',
      text: `هل تريد ${newStatus === 'approved' ? 'الموافقة على' : 'رفض'} هذا التقييم؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(
          `http://localhost:5000/api/testimonials/${id}/status`,
          { status: newStatus },
          { withCredentials: true }
        );
        toast.success(`تم ${newStatus === 'approved' ? 'الموافقة على' : 'رفض'} التقييم بنجاح`);
        fetchTestimonials();
      } catch (err) {
        toast.error("فشل في تحديث حالة التقييم");
      }
    }
  };

  const deleteTestimonial = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذا التقييم نهائياً",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/testimonials/${id}`, {
          withCredentials: true,
        });
        toast.success("تم حذف التقييم بنجاح");
        fetchTestimonials();
      } catch (err) {
        toast.error("فشل في حذف التقييم");
      }
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (testimonial.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || testimonial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "معتمد";
      case "pending":
        return "قيد المراجعة";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl" dir="rtl">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة التقييمات</h2>
            <p className="text-gray-500">إدارة وتنظيم تقييمات المستخدمين</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="بحث في التقييمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right bg-gray-50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right bg-gray-50"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي التقييمات</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{testimonials.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">التقييمات المعتمدة</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {testimonials.filter(t => t.status === "approved").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">قيد المراجعة</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {testimonials.filter(t => t.status === "pending").length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Filter className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">التقييمات المرفوضة</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {testimonials.filter(t => t.status === "rejected").length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <X className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-4 font-semibold text-right">المستخدم</th>
                <th className="p-4 font-semibold text-right">التقييم</th>
                <th className="p-4 font-semibold text-right">التاريخ</th>
                <th className="p-4 font-semibold text-right">الحالة</th>
                <th className="p-4 font-semibold text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {(testimonial.userId?.name || 'مجهول').charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {testimonial.userId?.name || 'مجهول'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 max-w-md">
                    <p className="line-clamp-2">{testimonial.content}</p>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(testimonial.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(testimonial.status)}`}>
                      {getStatusText(testimonial.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {testimonial.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(testimonial._id, "approved")}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="موافقة"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(testimonial._id, "rejected")}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="رفض"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteTestimonial(testimonial._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManagement; 