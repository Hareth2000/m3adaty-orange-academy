// // src/components/AdminDashboard/OrdersPage.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Check, XCircle } from "lucide-react";
// import { toast } from "react-hot-toast";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/admin/rentals", {
//         withCredentials: true,
//       });
//       setOrders(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/rentals/${id}/status`,
//         { status },
//         { withCredentials: true }
//       );
//       toast.success("تم تحديث حالة الطلب");
//       fetchOrders();
//     } catch (err) {
//       toast.error("فشل في تحديث الحالة");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="space-y-6 text-right">
//       <h2 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h2>
//       <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="p-3">المستخدم</th>
//             <th className="p-3">المعدة</th>
//             <th className="p-3">تاريخ البدء</th>
//             <th className="p-3">تاريخ الانتهاء</th>
//             <th className="p-3">الحالة</th>
//             <th className="p-3">إجراءات</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order._id} className="border-b text-right">
//               <td className="p-3">{order.user?.name}</td>
//               <td className="p-3">{order.equipment?.title}</td>
//               <td className="p-3">{new Date(order.startDate).toLocaleDateString()}</td>
//               <td className="p-3">{new Date(order.endDate).toLocaleDateString()}</td>
//               <td className="p-3">{order.status}</td>
//               <td className="p-3 flex gap-2 justify-end">
//                 <button
//                   onClick={() => updateStatus(order._id, "accepted")}
//                   className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                 >
//                   <Check size={16} />
//                 </button>
//                 <button
//                   onClick={() => updateStatus(order._id, "rejected")}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   <XCircle size={16} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrdersPage;


// src/components/AdminDashboard/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, XCircle, Loader2, Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/rentals", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل بيانات الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, userName, equipmentName) => {
    const statusText = status === "accepted" ? "قبول" : "رفض";
    const result = await Swal.fire({
      title: `${statusText} الطلب`,
      text: `هل أنت متأكد من ${statusText} طلب ${userName} للمعدة "${equipmentName}"؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === "accepted" ? '#4ade80' : '#f43f5e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `نعم، ${statusText}`,
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:5000/api/admin/rentals/${id}/status`,
          { status },
          { withCredentials: true }
        );
        toast.success(`تم ${status === "accepted" ? "قبول" : "رفض"} الطلب بنجاح`);
        fetchOrders();
      } catch (err) {
        toast.error("فشل في تحديث حالة الطلب");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "accepted": return "مقبول";
      case "rejected": return "مرفوض";
      case "completed": return "مكتمل";
      default: return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      (order.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.equipment?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <div className="space-y-6 rtl" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث عن طلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="accepted">مقبول</option>
            <option value="rejected">مرفوض</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-right">المستخدم</th>
                  <th className="p-4 font-semibold text-right">المعدة</th>
                  <th className="p-4 font-semibold text-right">تاريخ البدء</th>
                  <th className="p-4 font-semibold text-right">تاريخ الانتهاء</th>
                  <th className="p-4 font-semibold text-right">الحالة</th>
                  <th className="p-4 font-semibold text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-right">{order.user?.name || "غير معروف"}</td>
                      <td className="p-4 text-gray-600 text-right">{order.equipment?.title || "غير معروف"}</td>
                      <td className="p-4 text-gray-600 text-right">{formatDate(order.startDate)}</td>
                      <td className="p-4 text-gray-600 text-right">{formatDate(order.endDate)}</td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-start">
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(order._id, "accepted", order.user?.name, order.equipment?.title)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="قبول الطلب"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => updateStatus(order._id, "rejected", order.user?.name, order.equipment?.title)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="رفض الطلب"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {order.status !== "pending" && (
                            <span className="text-gray-400 text-xs">تم اتخاذ إجراء</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      لا توجد طلبات متطابقة مع معايير البحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;