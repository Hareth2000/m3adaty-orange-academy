// src/components/AdminDashboard/ContactMessagesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Search, Mail, Eye, Calendar, Download, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/messages", {
        withCredentials: true,
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
      toast.error("فشل في تحميل رسائل التواصل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const viewMessageDetails = (message) => {
    Swal.fire({
      title: message.subject || 'رسالة تواصل',
      html: `
        <div class="text-right" dir="rtl">
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p class="font-bold">الاسم:</p>
              <p>${message.name || 'غير معروف'}</p>
            </div>
            <div>
              <p class="font-bold">البريد الإلكتروني:</p>
              <p>${message.email || 'غير متوفر'}</p>
            </div>
            <div>
              <p class="font-bold">رقم الهاتف:</p>
              <p>${message.phone || 'غير متوفر'}</p>
            </div>
            <div>
              <p class="font-bold">تاريخ الإرسال:</p>
              <p>${formatDate(message.createdAt)}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="font-bold">الموضوع:</p>
            <p>${message.subject || 'بدون موضوع'}</p>
          </div>
          
          <div class="mt-4">
            <p class="font-bold">الرسالة:</p>
            <p class="whitespace-pre-wrap">${message.message || 'لا توجد رسالة'}</p>
          </div>
        </div>
      `,
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#fbbf24',
      width: '600px'
    });
  };

  const deleteMessage = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف هذه الرسالة نهائياً`,
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
        await axios.delete(`http://localhost:5000/api/admin/messages/${id}`, {
          withCredentials: true,
        });
        toast.success("تم حذف الرسالة بنجاح");
        fetchMessages();
      } catch (err) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleExportCSV = () => {
    try {
      const rows = [
        ["الاسم", "البريد الإلكتروني", "الموضوع", "الرسالة", "التاريخ"],
        ...filteredMessages.map(message => [
          message.name || "",
          message.email || "",
          message.subject || "",
          message.message || "",
          new Date(message.createdAt).toLocaleDateString('ar-EG')
        ])
      ];
      
      let csvContent = "data:text/csv;charset=utf-8," + 
        rows.map(row => row.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "رسائل-التواصل.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("تم تصدير البيانات بنجاح");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("فشل تصدير البيانات");
    }
  };

  const filteredMessages = messages.filter((message) => {
    // Search filter
    const matchesSearch =
      (message.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (message.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (message.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (message.message?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from && message.createdAt) {
      const messageDate = new Date(message.createdAt);
      matchesDateRange = matchesDateRange && messageDate >= new Date(dateRange.from);
    }
    if (dateRange.to && message.createdAt) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      const messageDate = new Date(message.createdAt);
      matchesDateRange = matchesDateRange && messageDate <= toDate;
    }

    return matchesSearch && matchesDateRange;
  });

  return (
    <div className="space-y-6 rtl" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">رسائل التواصل</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="بحث في الرسائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={18} />
            تصدير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">من تاريخ</p>
            <Calendar className="text-gray-400" size={18} />
          </div>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">إلى تاريخ</p>
            <Calendar className="text-gray-400" size={18} />
          </div>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-yellow-50 rounded-full p-3 mb-4">
              <Mail className="text-yellow-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد رسائل</h3>
            <p className="text-gray-500 max-w-md">لم يتم العثور على أي رسائل تطابق معايير البحث الخاصة بك.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-right">الاسم</th>
                  <th className="p-4 font-semibold text-right">البريد الإلكتروني</th>
                  <th className="p-4 font-semibold text-right">الموضوع</th>
                  <th className="p-4 font-semibold text-right">الرسالة</th>
                  <th className="p-4 font-semibold text-right">التاريخ</th>
                  <th className="p-4 font-semibold text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-right">{message.name || "غير معروف"}</td>
                    <td className="p-4 text-gray-600 text-right">{message.email || "غير متوفر"}</td>
                    <td className="p-4 text-gray-600 text-right">{message.subject || "بدون موضوع"}</td>
                    <td className="p-4 text-gray-600 text-right">
                      {truncateText(message.message)}
                    </td>
                    <td className="p-4 text-gray-600 text-right">{formatDate(message.createdAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-start">
                        <button
                          onClick={() => viewMessageDetails(message)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => deleteMessage(message._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف الرسالة"
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
        )}
      </div>
    </div>
  );
};

export default ContactMessagesPage;