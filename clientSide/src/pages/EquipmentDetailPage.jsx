import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import ar from 'date-fns/locale/ar-SA';

const EquipmentDetailPage = () => {
  const [bookedDates, setBookedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState("");

  // دالة للتحقق من تداخل التواريخ
  const isDateBooked = (date) => {
    return bookedDates.some(booked => {
      const bookedStart = new Date(booked.startDate);
      const bookedEnd = new Date(booked.endDate);
      return date >= bookedStart && date <= bookedEnd;
    });
  };

  // دالة للتحقق من صحة التواريخ المختارة
  const validateDates = (start, end) => {
    if (!start || !end) return false;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate >= endDate) {
      setDateError("يجب أن يكون تاريخ البداية قبل تاريخ النهاية");
      return false;
    }
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (isDateBooked(d)) {
        setDateError("بعض التواريخ المختارة محجوزة مسبقاً");
        return false;
      }
    }
    
    setDateError("");
    return true;
  };

  // مكون مخصص لعرض التواريخ في التقويم
  const renderDayContents = (day, date) => {
    if (isDateBooked(date)) {
      return (
        <div className="relative">
          <span className="text-red-500 font-bold">{day}</span>
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[8px] text-red-500 whitespace-nowrap">
            محجوز
          </span>
        </div>
      );
    }
    return day;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          تاريخ البداية
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            if (endDate && !validateDates(date, endDate)) {
              setEndDate(null);
            }
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          filterDate={(date) => !isDateBooked(date)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholderText="اختر تاريخ البداية"
          dateFormat="yyyy/MM/dd"
          locale={ar}
          dayClassName={(date) => 
            isDateBooked(date) ? 'bg-red-100 text-red-500 cursor-not-allowed hover:bg-red-100' : ''
          }
          renderDayContents={renderDayContents}
          showPopperArrow={false}
          popperPlacement="bottom-start"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          تاريخ النهاية
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            validateDates(startDate, date);
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()}
          filterDate={(date) => !isDateBooked(date)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholderText="اختر تاريخ النهاية"
          dateFormat="yyyy/MM/dd"
          locale={ar}
          dayClassName={(date) => 
            isDateBooked(date) ? 'bg-red-100 text-red-500 cursor-not-allowed hover:bg-red-100' : ''
          }
          renderDayContents={renderDayContents}
          showPopperArrow={false}
          popperPlacement="bottom-start"
        />
        {dateError && (
          <p className="text-red-500 text-xs mt-1">{dateError}</p>
        )}
      </div>

      {/* New section for displaying booked dates */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">التواريخ المحجوزة</h3>
        {bookedDates.length > 0 ? (
          <div className="space-y-3">
            {bookedDates.map((booking, index) => (
              <div 
                key={index}
                className="bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <div className="flex justify-between items-center">
                  <div className="text-red-600 font-medium">
                    من: {format(new Date(booking.startDate), 'yyyy/MM/dd', { locale: ar })}
                  </div>
                  <div className="text-red-600 font-medium">
                    إلى: {format(new Date(booking.endDate), 'yyyy/MM/dd', { locale: ar })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">لا توجد تواريخ محجوزة حالياً</p>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetailPage; 