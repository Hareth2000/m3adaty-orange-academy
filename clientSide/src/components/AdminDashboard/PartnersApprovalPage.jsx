// // src/components/AdminDashboard/PartnersApprovalPage.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { CheckCircle, XCircle } from "lucide-react";
// import { toast } from "react-hot-toast";

// const PartnersApprovalPage = () => {
//   const [partners, setPartners] = useState([]);

//   const fetchPendingPartners = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/admin/partners/pending", {
//         withCredentials: true,
//       });
//       setPartners(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const approvePartner = async (id) => {
//     try {
//       await axios.put(`http://localhost:5000/api/admin/partners/${id}/approve`, {}, {
//         withCredentials: true,
//       });
//       toast.success("تمت الموافقة على الشريك");
//       fetchPendingPartners();
//     } catch (err) {
//       toast.error("فشل في الموافقة");
//     }
//   };

//   const rejectPartner = async (id) => {
//     if (!window.confirm("هل تريد رفض هذا الطلب؟")) return;
//     try {
//       await axios.put(`http://localhost:5000/api/admin/partners/${id}/reject`, {}, {
//         withCredentials: true,
//       });
//       toast.success("تم رفض الطلب");
//       fetchPendingPartners();
//     } catch (err) {
//       toast.error("فشل في الرفض");
//     }
//   };

//   useEffect(() => {
//     fetchPendingPartners();
//   }, []);

//   return (
//     <div className="space-y-6 text-right">
//       <h2 className="text-2xl font-bold text-gray-800">طلبات الشراكة</h2>
//       <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="p-3">الاسم</th>
//             <th className="p-3">البريد</th>
//             <th className="p-3">نوع النشاط</th>
//             <th className="p-3">سنوات الخبرة</th>
//             <th className="p-3">إجراءات</th>
//           </tr>
//         </thead>
//         <tbody>
//           {partners.map((user) => (
//             <tr key={user._id} className="border-b text-right">
//               <td className="p-3">{user.name}</td>
//               <td className="p-3">{user.email}</td>
//               <td className="p-3">{user.businessType}</td>
//               <td className="p-3">{user.yearsOfExperience || "-"}</td>
//               <td className="p-3 flex gap-2 justify-end">
//                 <button
//                   onClick={() => approvePartner(user._id)}
//                   className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                 >
//                   <CheckCircle size={16} />
//                 </button>
//                 <button
//                   onClick={() => rejectPartner(user._id)}
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

// export default PartnersApprovalPage;


// src/components/AdminDashboard/PartnersApprovalPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Search, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';

const PartnersApprovalPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [businessTypes, setBusinessTypes] = useState([]);

  const fetchPendingPartners = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/partners/pending", {
        withCredentials: true,
      });
      setPartners(res.data);

      // Extract unique business types
      const uniqueBusinessTypes = [...new Set(res.data.map(partner => partner.businessType).filter(Boolean))];
      setBusinessTypes(uniqueBusinessTypes);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل طلبات الشراكة");
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (id, name) => {
    const result = await Swal.fire({
      title: 'الموافقة على الشراكة',
      text: `هل أنت متأكد من الموافقة على طلب الشراكة من ${name}؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4ade80',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، الموافقة',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/admin/partners/${id}/approve`, {}, {
          withCredentials: true,
        });
        toast.success(`تمت الموافقة على الشراكة مع ${name}`);
        fetchPendingPartners();
        Swal.fire(
          'تمت الموافقة!',
          `تم قبول طلب الشراكة من ${name} بنجاح.`,
          'success'
        );
      } catch (err) {
        toast.error("فشل في الموافقة على الطلب");
        Swal.fire(
          'خطأ!',
          'حدث خطأ أثناء الموافقة على طلب الشراكة.',
          'error'
        );
      }
    }
  };

  const rejectPartner = async (id, name) => {
    const result = await Swal.fire({
      title: 'رفض طلب الشراكة',
      text: `هل أنت متأكد من رفض طلب الشراكة من ${name}؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، رفض الطلب',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/admin/partners/${id}/reject`, {}, {
          withCredentials: true,
        });
        toast.success(`تم رفض طلب الشراكة من ${name}`);
        fetchPendingPartners();
        Swal.fire(
          'تم الرفض!',
          `تم رفض طلب الشراكة من ${name} بنجاح.`,
          'success'
        );
      } catch (err) {
        toast.error("فشل في رفض الطلب");
        Swal.fire(
          'خطأ!',
          'حدث خطأ أثناء رفض طلب الشراكة.',
          'error'
        );
      }
    }
  };

  const viewPartnerDetails = async (partner) => {
    let certHTML = '';
    if (partner.certifications && partner.certifications.length > 0) {
      certHTML = `
        <div class="mt-4">
          <h3 class="text-lg font-bold mb-2">الشهادات:</h3>
          <ul class="list-disc pr-5">
            ${partner.certifications.map(cert => `<li>${cert}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    await Swal.fire({
      title: `معلومات الشريك: ${partner.name}`,
      html: `
        <div class="text-right" dir="rtl">
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p class="font-bold">البريد الإلكتروني:</p>
              <p>${partner.email}</p>
            </div>
            <div>
              <p class="font-bold">رقم الهاتف:</p>
              <p>${partner.phone || 'غير متوفر'}</p>
            </div>
            <div>
              <p class="font-bold">نوع النشاط:</p>
              <p>${partner.businessType || 'غير محدد'}</p>
            </div>
            <div>
              <p class="font-bold">سنوات الخبرة:</p>
              <p>${partner.yearsOfExperience || 'غير محدد'}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="font-bold">وصف النشاط:</p>
            <p>${partner.businessDescription || 'لا يوجد وصف'}</p>
          </div>
          
          ${certHTML}
          
          <div class="mt-4">
            <p class="font-bold">تاريخ الطلب:</p>
            <p>${new Date(partner.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      `,
      confirmButtonText: 'إغلاق',
      width: '600px'
    });
  };

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = 
      (partner.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (partner.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (partner.businessDescription?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesBusinessType = businessTypeFilter === "all" || partner.businessType === businessTypeFilter;
    
    return matchesSearch && matchesBusinessType;
  });

  return (
    <div className="space-y-6 rtl" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">طلبات الشراكة</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث عن طلب شراكة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
            />
          </div>
          
          {businessTypes.length > 0 && (
            <select
              value={businessTypeFilter}
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
            >
              <option value="all">جميع أنواع النشاط</option>
              {businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-yellow-50 rounded-full p-3 mb-4">
              <CheckCircle className="text-yellow-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد طلبات شراكة</h3>
            <p className="text-gray-500 max-w-md">لا توجد طلبات شراكة قيد الانتظار حالياً، ستظهر الطلبات الجديدة هنا عند تقديمها.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-right">الاسم</th>
                  <th className="p-4 font-semibold text-right">البريد الإلكتروني</th>
                  <th className="p-4 font-semibold text-right">نوع النشاط</th>
                  <th className="p-4 font-semibold text-right">سنوات الخبرة</th>
                  <th className="p-4 font-semibold text-right">تاريخ الطلب</th>
                  <th className="p-4 font-semibold text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPartners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-right">{partner.name}</td>
                    <td className="p-4 text-gray-600 text-right">{partner.email}</td>
                    <td className="p-4 text-right">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {partner.businessType || "غير محدد"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-right">{partner.yearsOfExperience || "-"}</td>
                    <td className="p-4 text-gray-600 text-right">
                      {new Date(partner.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-start">
                        <button
                          onClick={() => viewPartnerDetails(partner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Info size={18} />
                        </button>
                        <button
                          onClick={() => approvePartner(partner._id, partner.name)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="الموافقة على الطلب"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => rejectPartner(partner._id, partner.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="رفض الطلب"
                        >
                          <XCircle size={18} />
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

export default PartnersApprovalPage;