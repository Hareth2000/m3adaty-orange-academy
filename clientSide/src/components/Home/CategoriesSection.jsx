import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoriesSection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "آليات ثقيلة",
      description:
        "معدات ثقيلة للبناء والتشييد مع أعلى معايير الجودة والسلامة.",
      image:
        "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      count: "25+",
      path: "/categories?category=heavy-machinery",
      color: "#FFB800",
    },
    {
      title: "عدد صناعية",
      description:
        "أدوات صناعية موثوقة لمختلف الاستخدامات والمشاريع الاحترافية.",
      image:
        "https://images.pexels.com/photos/7484788/pexels-photo-7484788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      count: "18+",
      path: "/categories?category=industrial-tools",
      color: "#FFB800",
    },
    {
      title: "عدد زراعية",
      description:
        "معدات زراعية حديثة لتحسين الإنتاجية والكفاءة في القطاع الزراعي.",
      image:
        "https://images.pexels.com/photos/2255801/pexels-photo-2255801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      count: "15+",
      path: "/categories?category=agricultural-tools",
      color: "#FFB800",
    },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
            تصفح فئاتنا
          </h2>
          <p className="text-[#616161] max-w-2xl mx-auto">
            نوفر مجموعة واسعة من المعدات الصناعية والزراعية المتخصصة لتلبية جميع
            احتياجات مشاريعك بكفاءة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(category.path)}
              className="group cursor-pointer"
            >
              <div className="relative bg-[#1A1A1A] rounded-2xl overflow-hidden">
                {/* الصورة مع تأثير التدرج */}
                <div className="relative h-80">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1A1A]/50 to-[#1A1A1A]"></div>
                </div>

                {/* المحتوى */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* العدد */}
                  <div className="flex items-center justify-end">
                    <span className="bg-[#FFB800] text-[#1A1A1A] px-4 py-2 rounded-full text-sm font-bold">
                      {category.count} معدات
                    </span>
                  </div>

                  {/* العنوان والوصف */}
                  <div className="mt-auto">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FFB800] transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-white/80 mb-6 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {/* زر التصفح */}
                    <div className="flex items-center text-[#FFB800] group-hover:translate-x-2 transition-transform duration-300">
                      <span className="font-medium">تصفح الفئة</span>
                      <ArrowLeft className="mr-2" size={20} />
                    </div>
                  </div>
                </div>

                {/* تأثير التحويم */}
                <div className="absolute inset-0 border-2 border-[#FFB800] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;