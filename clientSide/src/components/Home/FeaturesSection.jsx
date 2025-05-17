import React from 'react';
import { 
  Truck, 
  Shield, 
  Clock, 
  Star, 
  Users, 
  CheckCircle
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'توصيل سريع',
      description: 'خدمة توصيل سريعة وفعالة لجميع أنحاء المملكة'
    },
    {
      icon: Shield,
      title: 'ضمان الجودة',
      description: 'ضمان على جميع المعدات وخدمة صيانة متكاملة'
    },
    {
      icon: Clock,
      title: 'متاح 24/7',
      description: 'خدمة عملاء متاحة على مدار الساعة'
    },
    {
      icon: Star,
      title: 'جودة عالية',
      description: 'معدات عالية الجودة وموثوقة من أفضل الموردين'
    },
    {
      icon: Users,
      title: 'فريق متخصص',
      description: 'فريق من الخبراء لمساعدتك في اختيار المعدات المناسبة'
    },
    {
      icon: CheckCircle,
      title: 'سهولة الاستخدام',
      description: 'منصة سهلة الاستخدام مع واجهة عربية كاملة'
    }
  ];

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
            لماذا تختار معداتي؟
          </h2>
          <p className="text-[#616161] max-w-xl mx-auto">
            نقدم لك أفضل الخدمات وأحدث المعدات لتلبية احتياجات مشروعك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-[#F6F4F4] rounded-2xl p-6 border border-gray-100 hover:border-[#FFB800] transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300 shadow-md">
                  <feature.icon className="text-[#FFB800]" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#FFB800] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-[#616161]">
                  {feature.description}
                </p>

                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[#FFB800]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
