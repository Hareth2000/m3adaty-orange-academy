// src/components/AdminDashboard/UsersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, UserCog, Search, Loader2, Edit2, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        withCredentials: true,
      });
      console.log('All users data:', res.data);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل بيانات المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, userName) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف المستخدم ${userName} نهائياً`,
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
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          withCredentials: true,
        });
        toast.success("تم حذف المستخدم بنجاح");
        fetchUsers();
        Swal.fire(
          'تم الحذف!',
          'تم حذف المستخدم بنجاح.',
          'success'
        );
      } catch (err) {
        toast.error("حدث خطأ أثناء الحذف");
        Swal.fire(
          'خطأ!',
          'حدث خطأ أثناء حذف المستخدم.',
          'error'
        );
      }
    }
  };

  const toggleRole = async (id, userName, currentRole) => {
    const newRole = currentRole === "admin" ? "مستخدم" : "مشرف";
    const result = await Swal.fire({
      title: 'تغيير الدور',
      text: `هل تريد تغيير دور ${userName} إلى ${newRole}؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، قم بالتغيير',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/admin/users/${id}/toggle-role`, {}, {
          withCredentials: true,
        });
        toast.success("تم تغيير الدور");
        fetchUsers();
        Swal.fire(
          'تم التغيير!',
          `تم تغيير دور ${userName} إلى ${newRole} بنجاح.`,
          'success'
        );
      } catch (err) {
        toast.error("فشل في تغيير الدور");
        Swal.fire(
          'خطأ!',
          'حدث خطأ أثناء تغيير الدور.',
          'error'
        );
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "admin" && user?.role === "admin") ||
                         (filter === "user" && user?.role !== "admin");
    
    return matchesSearch && matchesFilter;
  });

  const getRoleBadgeColor = (role) => {
    return role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  };

  const getPartnerStatusBadgeColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 rtl" dir="rtl">
      {/* Enhanced Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h2>
            <p className="text-gray-500">إدارة حسابات المستخدمين وتفاصيلهم</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="بحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right bg-gray-50"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right bg-gray-50"
            >
              <option value="all">جميع المستخدمين</option>
              <option value="admin">المشرفين</option>
              <option value="user">المستخدمين</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{users.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Users className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المشرفين</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.filter(user => user.role === "admin").length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المستخدمين العاديين</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.filter(user => user.role === "user").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">طلبات الشراكة المعلقة</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.filter(user => user.partnerStatus === "pending").length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table Section */}
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
                  <th className="p-4 font-semibold text-right">البريد الإلكتروني</th>
                  <th className="p-4 font-semibold text-right">الدور</th>
                  <th className="p-4 font-semibold text-right">حالة الشراكة</th>
                  <th className="p-4 font-semibold text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role === "admin" ? "مشرف" : "مستخدم"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPartnerStatusBadgeColor(user.partnerStatus)}`}>
                        {user.partnerStatus === "approved" ? "موافق عليه" : 
                         user.partnerStatus === "pending" ? "قيد الانتظار" : 
                         user.partnerStatus === "rejected" ? "مرفوض" : "غير متقدم"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRole(user._id, user.name, user.role)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تغيير الدور"
                        >
                          <UserCog size={18} />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, user.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف المستخدم"
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

export default UsersPage;