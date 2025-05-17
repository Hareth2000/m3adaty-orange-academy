import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-[#F6F4F4]">
      {/* خلفية الفيديو */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/src/assets/videos/hero-poster.jpg"
        >
          <source src="/src/assets/Hero.mp4" type="video/mp4" />
        </video>
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-[#1A1A1A]/60"></div>
      </div>

      {/* المحتوى */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center md:items-start text-center md:text-right">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            حلول متكاملة
            <span className="text-[#FFB800]"> لتأجير المعدات&nbsp;</span>
            الصناعية
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed">
            نوفر لك أحدث المعدات الصناعية مع خدمة مميزة ودعم فني متواصل
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/categories"
                className="bg-[#FFB800] text-[#1A1A1A] px-8 py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 font-bold hover:bg-[#E5A700]"
              >
                <span>ابدأ الآن</span>
                <ChevronLeft size={18} />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="border border-white text-white px-8 py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10"
              >
                <span>تواصل معنا</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* إحصائيات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-8 left-0 right-0"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "معدة متوفرة", value: 150, suffix: "+" },
                { label: "عميل راضٍ", value: 500, suffix: "+" },
                { label: "خدمة", value: 10, suffix: "+" },
                { label: "ساعة دعم يومياً", value: 24 },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-md p-4 text-center hover:bg-white/20 transition-colors duration-300"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {isVisible && (
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        suffix={stat.suffix}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    )}
                  </h3>
                  <p className="text-sm text-white/80">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;