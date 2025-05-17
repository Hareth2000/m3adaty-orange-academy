import React from "react";
import { Mail, Bell, BookOpen, Gift } from "lucide-react";
import { motion } from "framer-motion";

const NewsletterSection = () => {
  return (
    <section className="py-24 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-6">
            ابقَ على اطلاع بآخر العروض
          </h2>
          <p className="text-lg text-[#616161] mb-12 leading-relaxed">
            اشترك في نشرتنا البريدية لتكون أول من يعرف عن العروض الخاصة والخصومات الحصرية
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#F6F4F4] to-white p-8 rounded-2xl shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail className="text-[#616161]" size={20} />
                </div>
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full px-4 py-4 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all duration-300"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#1A1A1A] text-white rounded-xl hover:bg-black transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
              >
                اشتراك
              </motion.button>
            </div>

            <p className="text-sm text-[#616161] mt-6 text-center">
              نحن نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي طرف ثالث.
            </p>
          </motion.div>

          {/* مزايا الاشتراك */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: <Bell className="w-6 h-6" />,
                title: "أحدث العروض",
                description: "احصل على آخر العروض والخصومات قبل الجميع"
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "نصائح ومقالات",
                description: "اطلع على نصائح مفيدة حول استخدام المعدات"
              },
              {
                icon: <Gift className="w-6 h-6" />,
                title: "عروض حصرية",
                description: "عروض خاصة للمشتركين في النشرة البريدية فقط"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#F6F4F4] to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#1A1A1A]">{feature.icon}</span>
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-3 text-lg">{feature.title}</h3>
                <p className="text-[#616161] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;