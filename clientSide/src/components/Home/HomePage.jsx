import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import NewsletterSection from "./NewsletterSection";
import TestimonialsSection from "./TestimonialsSection";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });
  }, []);

  // تحديد الألوان الرئيسية للتطبيق
  const theme = {
    primary: "#1A1A1A",    // للنصوص والأزرار الأساسية
    secondary: "#FFB800",  // للتأكيد والتمييز (الذهبي)
    background: "#FFFFFF", // للخلفيات
    light: "#F6F4F4",      // للخلفيات الثانوية
    gray: "#616161",       // للنصوص الثانوية
    lightGray: "#565656"   // للنصوص الأقل أهمية
  };

  return (
    <div className="font-sans" dir="rtl">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories Section */}
      <div data-aos="fade-up" className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] h-1.5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFB800] to-transparent shadow-lg mx-auto" style={{ width: '60%' }}></div>
        </div>
        <CategoriesSection />
      </div>
 
      {/* Features Section */}
      <div data-aos="fade-up" className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] h-1.5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFB800] to-transparent shadow-lg mx-auto" style={{ width: '60%' }}></div>
        </div>
        <FeaturesSection />
      </div>
      
      {/* How It Works Section */}
      <div data-aos="fade-up" className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] h-1.5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFB800] to-transparent shadow-lg mx-auto" style={{ width: '60%' }}></div>
        </div>
        <HowItWorksSection />
      </div>
      
      {/* Testimonials Section */}
      <div data-aos="fade-up" className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] h-1.5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFB800] to-transparent shadow-lg mx-auto" style={{ width: '60%' }}></div>
        </div>
        <TestimonialsSection />
      </div>
      
   
      
      {/* Newsletter Section */}
      <div data-aos="fade-up" className="relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] h-1.5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFB800] to-transparent shadow-lg mx-auto" style={{ width: '60%' }}></div>
        </div>
        <NewsletterSection />
      </div>
  
      {/* زر العودة للأعلى */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#FFB800] text-[#1A1A1A] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e5a700] transition-colors duration-300 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;