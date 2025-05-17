import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FeaturedEquipmentSection = () => {
  const navigate = useNavigate();

  const featuredEquipment = [
    {
      id: 1,
      title: "حفار هيدروليكي",
      category: "آليات ثقيلة",
      image: "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "1500",
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      title: "رافعة برجية",
      category: "آليات ثقيلة",
      image: "https://images.pexels.com/photos/7484788/pexels-photo-7484788.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "2000",
      rating: 4.9,
      reviews: 18
    },
    {
      id: 3,
      title: "معدات زراعية",
      category: "عدد زراعية",
      image: "https://images.pexels.com/photos/2255801/pexels-photo-2255801.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "800",
      rating: 4.7,
      reviews: 32
    }
  ];

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">
            المعدات المميزة
          </h2>
          <button 
            onClick={() => navigate('/equipment')}
            className="flex items-center gap-2 text-[#FFB800] hover:text-[#1A1A1A] transition-colors duration-300"
          >
            <span>عرض الكل</span>
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEquipment.map((equipment) => (
            <div 
              key={equipment.id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={equipment.image}
                  alt={equipment.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-[#FFB800] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-bold">
                  {equipment.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                  {equipment.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-[#FFB800] font-bold">{equipment.rating}</span>
                    <span className="text-[#616161]">({equipment.reviews} تقييم)</span>
                  </div>
                  <div className="text-[#1A1A1A] font-bold">
                    {equipment.price} ريال/يوم
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/equipment/${equipment.id}`)}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg hover:bg-[#FFB800] transition-colors duration-300"
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEquipmentSection; 