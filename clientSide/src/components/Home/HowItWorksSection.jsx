import React from "react";
import { Search, Calendar, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "ابحث عن المعدة",
      description: "تصفح مجموعتنا الواسعة من المعدات الصناعية",
    },
    {
      icon: Calendar,
      title: "حدد المدة",
      description: "اختر فترة الإيجار المناسبة لمشروعك",
    },
    {
      icon: Truck,
      title: "التوصيل",
      description: "نقوم بتوصيل المعدات إلى موقع المشروع",
    },
    {
      icon: CheckCircle,
      title: "استلام المعدة",
      description: "استلم المعدات وابدأ العمل فوراً",
    }
  ];

  return (
    <section className="py-24 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-6">
            كيف نعمل في 4 خطوات بسيطة
          </h2>
          <p className="text-lg text-[#616161] max-w-2xl mx-auto leading-relaxed">
            نهدف إلى جعل عملية استئجار المعدات سهلة وسريعة قدر الإمكان لتوفير وقت وجهد عملائنا الكرام
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-[#F6F4F4] rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#FFB800] text-[#1A1A1A] rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {index + 1}
              </div>
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <step.icon className="text-[#1A1A1A]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{step.title}</h3>
              <p className="text-[#616161] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* خطوط اتصال بين الخطوات */}
        <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 border-t-2 border-dashed border-[#FFB800]/50 -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/categories"
              className="inline-block bg-[#FFB800] text-[#1A1A1A] px-10 py-4 rounded-xl hover:bg-[#E5A700] transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
            >
              ابدأ الآن
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;