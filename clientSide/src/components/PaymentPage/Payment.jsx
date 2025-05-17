import React, { useState } from 'react';
import Swal from "sweetalert2";
import { CreditCard, Mail, User, MapPin, Calendar, Lock, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();


  const urlParams = new URLSearchParams(location.search);
  const price = urlParams.get("price");  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    zipCode: '',
    country: 'الأردن',
    paymentMethod: 'creditCard'
  });

  const paymentMethods = [
    { id: 'creditCard', name: 'بطاقة ائتمان', icon: CreditCard },
    { id: 'paypal', name: 'باي بال', icon: Mail },
    { id: 'cash', name: 'كاش', icon: DollarSign }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const paymentData = {
      ...formData,
      amount: 100, // يمكنك تعديل المبلغ حسب الحاجة
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Swal.fire({
          title: "نجاح!",
          text: "تم إتمام عملية الدفع بنجاح!",
          icon: "success",
          confirmButtonText: "حسنًا",
          confirmButtonColor: '#FF7517',
          timer: 3000,
        });
        navigate('/'); // توجيه المستخدم إلى صفحة النجاح
      } else {
        Swal.fire({
          title: "خطأ!",
          text: result.message || "حدث خطأ أثناء معالجة الدفع",
          icon: "error",
          confirmButtonText: "حاول مرة أخرى",
          confirmButtonColor: '#FF7517',
          timer: 4000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء الاتصال بالخادم.",
        icon: "error",
        confirmButtonText: "حسنًا",
        confirmButtonColor: '#FF7517',
      });
      console.error("خطأ أثناء إرسال الطلب:", error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
      if (cleaned.length <= 16) {
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setFormData({ ...formData, [name]: formatted });
      }
    } 
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        let formatted = cleaned;
        if (cleaned.length > 2) {
          formatted = cleaned.slice(0, 2) + ' / ' + cleaned.slice(2);
        }
        setFormData({ ...formData, [name]: formatted });
      }
    }
    else if (name === 'cvc') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        setFormData({ ...formData, [name]: cleaned });
      }
    }
    else if (name === 'zipCode') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 5) {
        setFormData({ ...formData, [name]: cleaned });
      }
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* رأس الصفحة */}
          <div className="bg-yellow-500 text-white p-6">
            <h1 className="text-2xl font-bold">معلومات الدفع</h1>
            <p className="text-white/80 mt-1">أكمل عملية الدفع بأمان وسهولة</p>
          </div>

          <div className="p-6">
            {/* مبلغ الدفع */}
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-[#2C2727]/70 mb-1">المبلغ الإجمالي</p>
              <p className="text-2xl font-bold text-yellow-600">{price} دينار أردني</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* حقل البريد الإلكتروني */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2C2727] mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right" 
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              {/* طرق الدفع */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2C2727] mb-2">طريقة الدفع</label>
                <div className="grid grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-yellow-500 bg-yellow-100'
                          : 'border-gray-300 hover:border-yellow-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <method.icon className={`h-6 w-6 mb-2 ${
                        formData.paymentMethod === method.id ? 'text-yellow-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm ${
                        formData.paymentMethod === method.id ? 'text-yellow-600' : 'text-gray-600'
                      }`}>{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* عرض حقول الدفع حسب طريقة الدفع المختارة */}
              {formData.paymentMethod === 'creditCard' && (
                <>
                  {/* حقل اسم صاحب البطاقة */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2C2727] mb-2">اسم صاحب البطاقة</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right" 
                        placeholder="الاسم الرباعي"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* حقل رقم البطاقة */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2C2727] mb-2">رقم البطاقة</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right" 
                        placeholder="1234 1234 1234 1234"
                        maxLength="19"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* صف للتاريخ ورمز التحقق */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2727] mb-2">تاريخ الانتهاء</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className="w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right" 
                          placeholder="MM / YY"
                          maxLength="7"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2727] mb-2">رمز التحقق CVC</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="cvc"
                          value={formData.cvc}
                          onChange={handleChange}
                          className="w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right" 
                          placeholder="CVC"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {formData.paymentMethod === 'paypal' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-[#2C2727]/80 mb-2">سيتم توجيهك إلى موقع باي بال لإتمام عملية الدفع</p>
                  <p className="text-sm text-[#2C2727]/60">يرجى التأكد من استخدام نفس البريد الإلكتروني المسجل في الموقع</p>
                </div>
              )}

              {formData.paymentMethod === 'cash' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-[#2C2727]/80 mb-2">سيتم التواصل معك لتحديد موعد استلام المبلغ نقداً</p>
                  <p className="text-sm text-[#2C2727]/60">يرجى التأكد من صحة معلومات الاتصال الخاصة بك</p>
                </div>
              )}

              {/* صف للرمز البريدي والدولة */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C2727] mb-2">الرمز البريدي</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right" 
                      placeholder="12345"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2727] mb-2">الدولة</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-right appearance-none"
                  >
                    <option value="الأردن">الأردن</option>
                    <option value="السعودية">السعودية</option>
                    <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                    <option value="مصر">مصر</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="البحرين">البحرين</option>
                    <option value="عمان">عمان</option>
                  </select>
                </div>
              </div>
              
              {/* زر الدفع */}
              <button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
              >
                {formData.paymentMethod === 'creditCard' ? 'إتمام الدفع' : 
                 formData.paymentMethod === 'paypal' ? 'الانتقال إلى باي بال' : 
                 'تأكيد الطلب'}
                <ArrowRight className="h-4 w-4" />
              </button>
              
              {/* شعار الأمان */}
              <div className="mt-4 flex items-center justify-center text-[#2C2727]/60 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                الدفع مؤمّن ومشفر
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;