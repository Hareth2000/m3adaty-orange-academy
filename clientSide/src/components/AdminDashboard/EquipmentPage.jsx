// // src/components/AdminDashboard/EquipmentPage.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2 } from "lucide-react";
// import { toast } from "react-hot-toast";

// const EquipmentPage = () => {
//   const [equipment, setEquipment] = useState([]);

//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/admin/equipment", {
//         withCredentials: true,
//       });
//       setEquipment(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteEquipment = async (id) => {
//     if (!window.confirm("هل أنت متأكد من حذف هذه المعدة؟")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/equipment/${id}`, {
//         withCredentials: true,
//       });
//       toast.success("تم حذف المعدة");
//       fetchEquipment();
//     } catch (err) {
//       toast.error("خطأ أثناء الحذف");
//     }
//   };

//   useEffect(() => {
//     fetchEquipment();
//   }, []);

//   return (
//     <div className="space-y-6 text-right">
//       <h2 className="text-2xl font-bold text-gray-800">إدارة المعدات</h2>
//       <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="p-3">الاسم</th>
//             <th className="p-3">التصنيف</th>
//             <th className="p-3">السعر اليومي</th>
//             <th className="p-3">المالك</th>
//             <th className="p-3">الحالة</th>
//             <th className="p-3">إجراءات</th>
//           </tr>
//         </thead>
//         <tbody>
//           {equipment.map((item) => (
//             <tr key={item._id} className="border-b text-right">
//               <td className="p-3">{item.title}</td>
//               <td className="p-3">{item.category}</td>
//               <td className="p-3">{item.dailyRate} د.أ</td>
//               <td className="p-3">{item.ownerId?.name || "غير معروف"}</td>
//               <td className="p-3">{item.availability ? "متوفرة" : "غير متوفرة"}</td>
//               <td className="p-3 flex gap-2 justify-end">
//                 <button
//                   onClick={() => deleteEquipment(item._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EquipmentPage;


// src/components/AdminDashboard/EquipmentPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Loader2, Search, Plus, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [softDeletedIds, setSoftDeletedIds] = useState([]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/equipment", {
        withCredentials: true,
      });
      setEquipment(res.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل بيانات المعدات");
    } finally {
      setLoading(false);
    }
  };

  const softDeleteEquipment = async (id, title) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم أرشفة المعدة "${title}" ولن تظهر في القائمة بعد الآن`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، أرشف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setSoftDeletedIds((prev) => [...prev, id]);
      toast.success("تم أرشفة المعدة بنجاح");
      Swal.fire(
        'تم الأرشفة!',
        'تم أرشفة المعدة بنجاح.',
        'success'
      );
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const filteredEquipment = equipment.filter((item) => {
    if (softDeletedIds.includes(item._id)) return false;
    const matchesSearch = 
      (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.ownerId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityBadgeColor = (isAvailable) => {
    return isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6 rtl" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المعدات</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث عن معدة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
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
                  <th className="p-4 font-semibold text-right">الاسم</th>
                  <th className="p-4 font-semibold text-right">التصنيف</th>
                  <th className="p-4 font-semibold text-right">السعر اليومي</th>
                  <th className="p-4 font-semibold text-right">المالك</th>
                  <th className="p-4 font-semibold text-right">الحالة</th>
                  <th className="p-4 font-semibold text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-right">{item.title}</td>
                      <td className="p-4 text-gray-600 text-right">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 text-right">{item.dailyRate} د.أ</td>
                      <td className="p-4 text-gray-600 text-right">{item.ownerId?.name || "غير معروف"}</td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityBadgeColor(item.availability)}`}>
                          {item.availability ? "متوفرة" : "غير متوفرة"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-start">
                          <button
                            onClick={() => softDeleteEquipment(item._id, item.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="أرشفة المعدة"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      لا توجد معدات متطابقة مع معايير البحث
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

export default EquipmentPage;