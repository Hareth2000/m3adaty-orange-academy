import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // أرسل البيانات إلى الباكند
      await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "موقعنا",
      info: "عمان، الأردن",
      subInfo: "شارع المدينة المنورة"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "اتصل بنا",
      info: "+962 7 9883 7302",
      subInfo: "من الأحد إلى الخميس"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "راسلنا",
      info: "info@m3adat.com",
      subInfo: "نرد خلال 24 ساعة"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "ساعات العمل",
      info: "9:00 ص - 5:00 م",
      subInfo: "السبت - الخميس"
    }
  ];

  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simple fade animation
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section - Modern Design with Gradient */}
      <section className="py-24 bg-gradient-to-r from-yellow-500/10 to-gray-100 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full -ml-48 -mb-48"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="bg-white p-10 rounded-2xl shadow-lg"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">تواصل معنا</h1>
              <div className="w-24 h-1 bg-yellow-500 mb-6 rounded-full"></div>
              <p className="text-gray-600 leading-relaxed mb-8">
                نحن هنا لمساعدتك في كل ما يتعلق بمشاريعك. تواصل معنا لأي استفسار أو اقتراح، وسنكون سعداء بالرد عليك في أسرع وقت.
              </p>
              <button 
                onClick={scrollToForm}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  أرسل رسالة الآن
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards - Modern, Clean Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                    <div className="text-yellow-500 group-hover:text-white">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-700 font-medium">{item.info}</p>
                    <p className="text-gray-500 text-sm mt-1">{item.subInfo}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Contact Form and Map Section - Modern Design */}
      <section id="contact-form" className="py-16 bg-gray-50 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full -ml-32"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">أرسل لنا رسالة</h2>
                <div className="w-16 h-1 bg-yellow-500 mb-4 rounded-full"></div>
                <p className="text-gray-600">نحن نقدر ملاحظاتك واقتراحاتك. املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-300"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-300"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-300"
                      placeholder="أدخل رقم هاتفك"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">الموضوع</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-300"
                      placeholder="موضوع الرسالة"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-300"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`
                      w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-white font-medium
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-yellow-500 hover:bg-yellow-600 transform hover:scale-105'
                      }
                      transition-all duration-300 shadow-md hover:shadow-lg
                    `}
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </button>
                </div>

                {submitStatus && (
                  <div className={`p-4 rounded-lg ${
                    submitStatus === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {submitStatus === 'success' 
                      ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' 
                      : 'حدث خطأ في إرسال الرسالة. الرجاء المحاولة مرة أخرى.'}
                  </div>
                )}
              </form>
            </motion.div>
            
            {/* Map Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54277.567169516605!2d35.8771497!3d31.9539494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b5fb85d7981af%3A0x631c30c0f8dc65e8!2sAmman!5e0!3m2!1sen!2sjo!4v1678374085782!5m2!1sen!2sjo"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
                className="h-full min-h-[400px]"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Social Media Section - Modern, Clean Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">تابعنا على مواقع التواصل الاجتماعي</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-8 rounded-full"></div>
            
            <div className="flex justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm hover:bg-yellow-500 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm hover:bg-yellow-500 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm hover:bg-yellow-500 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Chat Button - Modern Style */}
      <button 
        className="fixed bottom-6 left-6 bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-110 z-50"
        onClick={() => {/* تفعيل المحادثة المباشرة */}}
        aria-label="Live Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ContactUsPage;