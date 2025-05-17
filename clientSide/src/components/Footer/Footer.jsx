import React from "react";
import {
  Youtube,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  Clock,
  Mail,
} from "lucide-react";

const Footer = ({ onPageNavigate, onSocialMediaClick }) => {
  return (
    <footer className="bg-gradient-to-b from-[#2C2727] to-[#1a1717] text-white font-sans">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* تواصل معنا */}
          <div className="md:col-span-4 text-right">
            <h3 className="text-xl font-bold text-yellow-500 mb-6">تواصل معنا</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 ">
                <Phone size={18} className="text-yellow-500" />
                <span className="text-white/80 text-sm">00962791234567</span>
              
              </div>
              <div className="flex items-center gap-2 ">
                <Mail size={18} className="text-yellow-500" />
                <span className="text-white/80 text-sm">info@maedatek.com</span>

              </div>
              <div className="flex items-center gap-2 ">
                <MapPin size={18} className="text-yellow-500" />
                <span className="text-white/80 text-sm">المملكة الأردنية الهاشمية</span>

              </div>
              <div className="flex items-center gap-2 ">
                <Clock size={18} className="text-yellow-500" />
                <span className="text-white/80 text-sm">السبت - الخميس: 8:00 - 17:00</span>

              </div>
            </div>
          </div>

          {/* خدماتنا */}
          <div className="md:col-span-4 text-right">
            <h3 className="text-xl font-bold text-yellow-500 mb-6">خدماتنا</h3>
            <div className="flex flex-col gap-4">
              <button onClick={() => onPageNavigate("services")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                خدمات التأجير
              </button>
              <button onClick={() => onPageNavigate("offers")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                العروض الخاصة
              </button>
              <button onClick={() => onPageNavigate("register-partner")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                انضم كشريك
              </button>
              <button onClick={() => onPageNavigate("contact-us")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                تواصل معنا
              </button>
            </div>
          </div>

          {/* عن معدات تك */}
          <div className="md:col-span-4 text-right">
            <h3 className="text-xl font-bold text-yellow-500 mb-6">عن معدات تك</h3>
            <div className="flex flex-col gap-4">
              <button onClick={() => onPageNavigate("about-us")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                نبذة عن الشركة
              </button>
              <button onClick={() => onPageNavigate("equipment")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                معدات للتأجير
              </button>
              <button onClick={() => onPageNavigate("machinery")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                آليات للتأجير
              </button>
              <button onClick={() => onPageNavigate("partners")} className="text-white/80 hover:text-yellow-500 transition-colors text-right">
                شركاؤنا
              </button>
            </div>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-white/50 text-sm">
              جميع الحقوق محفوظة لشركة معدات تك © {new Date().getFullYear()}
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              {["facebook", "instagram", "linkedin", "twitter", "youtube"].map((platform) => {
                const Icon = {
                  youtube: Youtube,
                  twitter: Twitter,
                  linkedin: Linkedin,
                  instagram: Instagram,
                  facebook: Facebook,
                }[platform];

                return (
                  <button
                    key={platform}
                    onClick={() => onSocialMediaClick(platform)}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-yellow-500 flex items-center justify-center transition-all duration-300 group"
                  >
                    <Icon size={16} className="text-white/70 group-hover:text-white" />
                  </button>
                );
              })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <button onClick={() => onPageNavigate("privacy-policy")} className="text-white/50 hover:text-yellow-500 transition-colors">
                سياسة الخصوصية
              </button>
              <button onClick={() => onPageNavigate("terms")} className="text-white/50 hover:text-yellow-500 transition-colors">
                الشروط والأحكام
              </button>
            </div>
          </div>
        </div>
      </div>
   
    </footer>
    
  );
};

Footer.defaultProps = {
  onPageNavigate: (page) => console.log(`Navigating to page: ${page}`),
  onSocialMediaClick: (platform) => console.log(`Clicked social media platform: ${platform}`),
};

export default Footer;
