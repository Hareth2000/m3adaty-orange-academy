// src/components/AdminDashboard/AdsApprovalPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const AdsApprovalPage = () => {
  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/ads", {
        withCredentials: true,
      });
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الإعلان؟")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/ads/${id}`, {
        withCredentials: true,
      });
      toast.success("تم حذف الإعلان");
      fetchAds();
    } catch (err) {
      toast.error("فشل في حذف الإعلان");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="space-y-6 text-right">
      <h2 className="text-2xl font-bold text-gray-800">إعلانات المعدات</h2>
      <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">الاسم</th>
            <th className="p-3">الفئة</th>
            <th className="p-3">السعر اليومي</th>
            <th className="p-3">المالك</th>
            <th className="p-3">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad._id} className="border-b text-right">
              <td className="p-3">{ad.title}</td>
              <td className="p-3">{ad.category}</td>
              <td className="p-3">{ad.dailyRate} د.أ</td>
              <td className="p-3">{ad.ownerId?.name || "غير معروف"}</td>
              <td className="p-3 flex gap-2 justify-end">
                <button
                  onClick={() => deleteAd(ad._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdsApprovalPage;