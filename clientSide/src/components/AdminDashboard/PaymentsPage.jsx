// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2, Search, Calendar, Download, DollarSign } from "lucide-react";
// import { toast } from "react-hot-toast";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const PaymentsPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/api/admin/payments", {
//         withCredentials: true,
//       });
//       setPayments(res.data);

//       const total = res.data
//         .filter((p) => p.status === "completed" || p.status === "مكتمل")
//         .reduce((sum, p) => sum + (p.amount || 0), 0);
//       setTotalAmount(total);
//     } catch (err) {
//       toast.error("فشل في تحميل سجل المدفوعات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "مكتمل";
//       case "pending":
//         return "قيد الانتظار";
//       case "failed":
//         return "فشل";
//       case "refunded":
//         return "مسترد";
//       default:
//         return status;
//     }
//   };

//   const getStatusBadgeColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//       case "مكتمل":
//         return "bg-green-100 text-green-800";
//       case "pending":
//       case "قيد الانتظار":
//         return "bg-yellow-100 text-yellow-800";
//       case "failed":
//       case "فشل":
//         return "bg-red-100 text-red-800";
//       case "refunded":
//       case "مسترد":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatCurrency = (amount) => `${amount?.toLocaleString("ar-EG")} د.أ`;

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString("ar-EG", options);
//   };

//   const filteredPayments = payments.filter((payment) => {
//     const matchesSearch =
//       (payment.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//       (payment.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//       (payment.country?.toLowerCase() || "").includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" ||
//       payment.status?.toLowerCase() === statusFilter.toLowerCase();

//     let matchesDateRange = true;
//     const paymentDate = new Date(payment.createdAt);
//     if (dateRange.from)
//       matchesDateRange =
//         matchesDateRange && paymentDate >= new Date(dateRange.from);
//     if (dateRange.to) {
//       const toDate = new Date(dateRange.to);
//       toDate.setHours(23, 59, 59, 999);
//       matchesDateRange = matchesDateRange && paymentDate <= toDate;
//     }

//     return matchesSearch && matchesStatus && matchesDateRange;
//   });

//   const handleExportPDF = () => {
//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "pt",
//       format: "a4",
//     });

//     doc.setFont("helvetica", "normal");

//     const columns = [
//       { header: "الاسم", dataKey: "name" },
//       { header: "البريد الإلكتروني", dataKey: "email" },
//       { header: "الدولة", dataKey: "country" },
//       { header: "المبلغ", dataKey: "amount" },
//       { header: "الحالة", dataKey: "status" },
//       { header: "التاريخ", dataKey: "createdAt" },
//     ];

//     const rows = filteredPayments.map((payment) => ({
//       name: payment.name || "غير معروف",
//       email: payment.email || "غير متوفر",
//       country: payment.country || "-",
//       amount: formatCurrency(payment.amount),
//       status: getStatusText(payment.status),
//       createdAt: formatDate(payment.createdAt),
//     }));

//     autoTable(doc, {
//       head: [columns.map((col) => col.header)],
//       body: rows.map((row) => columns.map((col) => row[col.dataKey])),
//       styles: { font: "helvetica", fontStyle: "normal", halign: "right" },
//       headStyles: { fillColor: [255, 221, 77], textColor: [0, 0, 0] },
//       margin: { top: 50 },
//       didDrawPage: function () {
//         doc.setFontSize(18);
//         doc.text("سجل المدفوعات", doc.internal.pageSize.getWidth() / 2, 30, {
//           align: "center",
//         });
//       },
//     });

//     doc.save("سجل-المدفوعات.pdf");
//   };

//   return (
//     <div className="space-y-6 rtl" dir="rtl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h2 className="text-2xl font-bold text-gray-800">سجل المدفوعات</h2>
//         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//           <div className="relative flex-1 sm:flex-initial">
//             <Search
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="بحث..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full sm:w-64 pl-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-2 border rounded-lg"
//           >
//             <option value="all">جميع الحالات</option>
//             <option value="completed">مكتمل</option>
//             <option value="pending">قيد الانتظار</option>
//             <option value="failed">فشل</option>
//             <option value="refunded">مسترد</option>
//           </select>

//           <button
//             onClick={handleExportPDF}
//             className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <Download size={18} />
//             تصدير PDF
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <p className="text-sm text-gray-500 mb-2">إجمالي المدفوعات</p>
//           <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <p className="text-sm text-gray-500 mb-2">من تاريخ</p>
//           <input
//             type="date"
//             value={dateRange.from}
//             onChange={(e) =>
//               setDateRange({ ...dateRange, from: e.target.value })
//             }
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <p className="text-sm text-gray-500 mb-2">إلى تاريخ</p>
//           <input
//             type="date"
//             value={dateRange.to}
//             onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="animate-spin text-yellow-500" size={32} />
//           </div>
//         ) : filteredPayments.length === 0 ? (
//           <div className="text-center py-16 text-gray-500">لا توجد مدفوعات</div>
//         ) : (
//           <table className="w-full text-sm rtl" dir="rtl">
//             <thead className="bg-gray-50 text-gray-700">
//               <tr>
//                 <th className="p-4 text-right font-semibold">الاسم</th>
//                 <th className="p-4 text-right font-semibold">
//                   البريد الإلكتروني
//                 </th>
//                 <th className="p-4 text-right font-semibold">الدولة</th>
//                 <th className="p-4 text-right font-semibold">المبلغ</th>
//                 <th className="p-4 text-right font-semibold">الحالة</th>
//                 <th className="p-4 text-right font-semibold">التاريخ</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredPayments.map((payment) => (
//                 <tr key={payment._id} className="hover:bg-gray-50">
//                   <td className="p-4 text-right">
//                     {payment.name || "غير معروف"}
//                   </td>
//                   <td className="p-4 text-right">
//                     {payment.email || "غير متوفر"}
//                   </td>
//                   <td className="p-4 text-right">{payment.country || "-"}</td>
//                   <td className="p-4 text-right">
//                     {formatCurrency(payment.amount)}
//                   </td>
//                   <td className="p-4 text-right">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
//                         payment.status
//                       )}`}
//                     >
//                       {getStatusText(payment.status)}
//                     </span>
//                   </td>
//                   <td className="p-4 text-right">
//                     {formatDate(payment.createdAt)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentsPage;


// src/components/AdminDashboard/PaymentsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Search, Calendar, Download, DollarSign, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from 'sweetalert2';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/payments", {
        withCredentials: true,
      });
      setPayments(res.data);

      // Calculate total amount of successful payments
      const total = res.data
        .filter((p) => p.status === "completed" || p.status === "مكتمل")
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      setTotalAmount(total);

      // Calculate payment statistics
      const statusCounts = res.data.reduce((acc, payment) => {
        const status = payment.status?.toLowerCase() || "unknown";
        if (status === "completed" || status === "مكتمل") acc.completed++;
        else if (status === "pending" || status === "قيد الانتظار") acc.pending++;
        else if (status === "failed" || status === "فشل") acc.failed++;
        else if (status === "refunded" || status === "مسترد") acc.refunded++;
        return acc;
      }, { completed: 0, pending: 0, failed: 0, refunded: 0 });
      
      setStats(statusCounts);
    } catch (err) {
      console.error("Error loading payments", err);
      toast.error("فشل في تحميل سجل المدفوعات");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "failed":
        return "فشل";
      case "refunded":
        return "مسترد";
      default:
        return status || "غير معروف";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "مكتمل":
        return "bg-green-100 text-green-800";
      case "pending":
      case "قيد الانتظار":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "فشل":
        return "bg-red-100 text-red-800";
      case "refunded":
      case "مسترد":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0 د.أ";
    return `${amount.toLocaleString("ar-EG")} د.أ`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  const filteredPayments = payments.filter((payment) => {
    // Search filter
    const matchesSearch =
      (payment.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (payment.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (payment.country?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      payment.status?.toLowerCase() === statusFilter.toLowerCase();

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from && payment.createdAt) {
      const paymentDate = new Date(payment.createdAt);
      matchesDateRange = matchesDateRange && paymentDate >= new Date(dateRange.from);
    }
    if (dateRange.to && payment.createdAt) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      const paymentDate = new Date(payment.createdAt);
      matchesDateRange = matchesDateRange && paymentDate <= toDate;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleExportPDF = () => {
    try {
      toast.loading("جاري إنشاء ملف PDF...", { id: "pdf-export" });
      
      // Use html2pdf or html2canvas approach instead of direct jsPDF for Arabic support
      import('html2pdf.js')
        .then(html2pdf => {
          // Create a temporary div with the content
          const element = document.createElement('div');
          element.style.width = '100%';
          element.style.padding = '20px';
          element.style.fontFamily = 'Arial, sans-serif';
          element.dir = 'rtl';
          
          // Add title and date range
          let content = `
            <h1 style="text-align: center; color: #333;">سجل المدفوعات</h1>
          `;
          
          if (dateRange.from || dateRange.to) {
            content += `
              <p style="text-align: center; font-size: 14px; margin-bottom: 20px;">
                الفترة: ${dateRange.from ? formatDate(dateRange.from) : ''} 
                ${dateRange.from && dateRange.to ? 'إلى' : ''} 
                ${dateRange.to ? formatDate(dateRange.to) : ''}
              </p>
            `;
          }
          
          // Add table
          content += `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #FFC107; color: #000;">
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">الاسم</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">البريد الإلكتروني</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">الدولة</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">المبلغ</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">الحالة</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">التاريخ</th>
                </tr>
              </thead>
              <tbody>
          `;
          
          // Add rows
          filteredPayments.forEach(payment => {
            const statusColor = {
              'completed': '#d1fae5',
              'مكتمل': '#d1fae5',
              'pending': '#fef3c7',
              'قيد الانتظار': '#fef3c7',
              'failed': '#fee2e2',
              'فشل': '#fee2e2',
              'refunded': '#f3e8ff',
              'مسترد': '#f3e8ff'
            }[payment.status?.toLowerCase()] || '#f3f4f6';
            
            content += `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${payment.name || "غير معروف"}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${payment.email || "غير متوفر"}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${payment.country || "-"}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatCurrency(payment.amount)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd; background-color: ${statusColor};">${getStatusText(payment.status)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatDate(payment.createdAt)}</td>
              </tr>
            `;
          });
          
          content += `
              </tbody>
            </table>
          `;
          
          // Add summary
          content += `
            <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
              <p style="margin: 8px 0;"><strong>إجمالي المدفوعات:</strong> ${formatCurrency(totalAmount)}</p>
              <p style="margin: 8px 0;"><strong>عدد المعاملات:</strong> ${filteredPayments.length}</p>
            </div>
          `;
          
          element.innerHTML = content;
          document.body.appendChild(element);
          
          // Options for the PDF
          const options = {
            margin: 10,
            filename: 'سجل-المدفوعات.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
          };
          
          // Generate PDF
          html2pdf.default()
            .from(element)
            .set(options)
            .save()
            .then(() => {
              // Remove temporary element
              document.body.removeChild(element);
              toast.success("تم إنشاء ملف PDF بنجاح", { id: "pdf-export" });
            })
            .catch(err => {
              console.error("Error in html2pdf:", err);
              document.body.removeChild(element);
              toast.error("حدث خطأ أثناء إنشاء ملف PDF", { id: "pdf-export" });
            });
        })
        .catch(err => {
          console.error("Failed to load html2pdf:", err);
          toast.error("حدث خطأ أثناء تحميل مكتبة إنشاء PDF", { id: "pdf-export" });
          
          // Fallback to CSV if PDF fails
          try {
            const rows = [
              ["الاسم", "البريد الإلكتروني", "الدولة", "المبلغ", "الحالة", "التاريخ"],
              ...filteredPayments.map(payment => [
                payment.name || "غير معروف",
                payment.email || "غير متوفر",
                payment.country || "-",
                payment.amount,
                getStatusText(payment.status),
                formatDate(payment.createdAt)
              ])
            ];
            
            let csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "سجل-المدفوعات.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("تم تصدير البيانات بتنسيق CSV", { id: "pdf-export" });
          } catch (csvError) {
            console.error("Error exporting CSV:", csvError);
            toast.error("فشل تصدير البيانات", { id: "pdf-export" });
          }
        });
    } catch (error) {
      console.error("Error in export function:", error);
      toast.error("حدث خطأ أثناء إنشاء ملف PDF", { id: "pdf-export" });
    }
  };

  const handleViewPaymentDetails = (payment) => {
    Swal.fire({
      title: `تفاصيل المدفوعات: ${payment.name || "غير معروف"}`,
      html: `
        <div class="text-right" dir="rtl">
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p class="font-bold">البريد الإلكتروني:</p>
              <p>${payment.email || "غير متوفر"}</p>
            </div>
            <div>
              <p class="font-bold">رقم الهاتف:</p>
              <p>${payment.phone || "غير متوفر"}</p>
            </div>
            <div>
              <p class="font-bold">الدولة:</p>
              <p>${payment.country || "غير محدد"}</p>
            </div>
            <div>
              <p class="font-bold">المبلغ:</p>
              <p>${formatCurrency(payment.amount)}</p>
            </div>
            <div>
              <p class="font-bold">الحالة:</p>
              <p>${getStatusText(payment.status)}</p>
            </div>
            <div>
              <p class="font-bold">تاريخ العملية:</p>
              <p>${formatDate(payment.createdAt)}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="font-bold">معرف العملية:</p>
            <p>${payment.transactionId || payment._id || "غير متوفر"}</p>
          </div>
          
          <div class="mt-4">
            <p class="font-bold">ملاحظات:</p>
            <p>${payment.notes || "لا توجد ملاحظات"}</p>
          </div>
        </div>
      `,
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#fbbf24',
      width: '600px'
    });
  };

  return (
    <div className="space-y-6 rtl" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">سجل المدفوعات</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="بحث..."
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
            <option value="completed">مكتمل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="failed">فشل</option>
            <option value="refunded">مسترد</option>
          </select>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FileText size={18} />
            تصدير PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المدفوعات</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">حالة المدفوعات</p>
            </div>
            <div className="space-y-2 mt-1">
              <div className="flex justify-between">
                <span className="text-green-600 text-sm">مكتمل:</span>
                <span className="font-semibold">{stats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600 text-sm">قيد الانتظار:</span>
                <span className="font-semibold">{stats.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 text-sm">فشل:</span>
                <span className="font-semibold">{stats.failed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600 text-sm">مسترد:</span>
                <span className="font-semibold">{stats.refunded}</span>
              </div>
            </div>
          </div>
        </div>

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
        ) : filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-yellow-50 rounded-full p-3 mb-4">
              <DollarSign className="text-yellow-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد مدفوعات</h3>
            <p className="text-gray-500 max-w-md">لم يتم العثور على أي مدفوعات تطابق معايير البحث الخاصة بك.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 text-right font-semibold">الاسم</th>
                  <th className="p-4 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="p-4 text-right font-semibold">الدولة</th>
                  <th className="p-4 text-right font-semibold">المبلغ</th>
                  <th className="p-4 text-right font-semibold">الحالة</th>
                  <th className="p-4 text-right font-semibold">التاريخ</th>
                  <th className="p-4 text-right font-semibold">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-right">
                      {payment.name || "غير معروف"}
                    </td>
                    <td className="p-4 text-gray-600 text-right">
                      {payment.email || "غير متوفر"}
                    </td>
                    <td className="p-4 text-gray-600 text-right">{payment.country || "-"}</td>
                    <td className="p-4 text-gray-800 font-medium text-right">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          payment.status
                        )}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-right">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewPaymentDetails(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <FileText size={16} />
                      </button>
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

export default PaymentsPage;