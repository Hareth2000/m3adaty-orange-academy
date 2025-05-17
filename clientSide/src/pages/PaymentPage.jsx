import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get(`/api/rentals/${rentalId}`);
        setRental(response.data.rental);
      } catch (error) {
        toast.error('فشل في تحميل تفاصيل الطلب');
        navigate('/my-rentals');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId, navigate]);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      // هنا يمكنك إضافة منطق الدفع الفعلي
      // مثال: استخدام خدمة دفع خارجية مثل Stripe أو PayPal
      
      // بعد نجاح الدفع، قم بتحديث حالة الطلب
      await axios.put(`/api/rentals/${rentalId}/status`, {
        status: 'paid'
      });

      toast.success('تم الدفع بنجاح');
      navigate('/my-rentals');
    } catch (error) {
      toast.error('فشل في عملية الدفع');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  if (!rental) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">إكمال عملية الدفع</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">تفاصيل الطلب</h2>
            <p>المعدة: {rental.equipment.name}</p>
            <p>من: {new Date(rental.startDate).toLocaleDateString()}</p>
            <p>إلى: {new Date(rental.endDate).toLocaleDateString()}</p>
            <p className="font-bold mt-2">المبلغ الإجمالي: {rental.totalPrice} ريال</p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">معلومات الدفع</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">رقم البطاقة</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {processing ? 'جاري المعالجة...' : 'إتمام الدفع'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 