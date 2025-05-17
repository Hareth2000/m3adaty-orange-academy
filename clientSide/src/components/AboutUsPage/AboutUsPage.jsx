import React from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Users,
  Award,
  Clock,
  ThumbsUp,
  CheckCircle,
  Building,
  Truck,
  Shield,
  ArrowLeft,
  Calendar,
  Phone,
  MapPin,
  BadgeCheck,
  Star,
  Target,
  Heart,
  Building2,
  CheckCircle2,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

const AboutUsPage = () => {
  // قسم مؤسسي الشركة
  const founders = [
    {
      id: 1,
      name: "أحمد محمد",
      position: "المؤسس والرئيس التنفيذي",
      image: "src/assets/images/team/founder1.jpg",
      experience: "خبرة أكثر من 15 عامًا في مجال المعدات وتكنولوجيا المعلومات.",
    },
    {
      id: 2,
      name: "سارة أحمد",
      position: "مديرة العمليات",
      image: "src/assets/images/team/founder2.jpg",
      experience:
        "متخصصة في إدارة المشاريع وتحسين العمليات لتوفير أفضل تجربة للمستخدمين.",
    },
    {
      id: 3,
      name: "محمد علي",
      position: "مدير التكنولوجيا",
      image: "src/assets/images/team/founder3.jpg",
      experience:
        "مهندس برمجيات متمرس مع خبرة واسعة في تطوير المنصات الرقمية الآمنة والفعالة.",
    },
  ];

  // قسم تاريخ الشركة
  const companyHistory = [
    {
      year: "2018",
      title: "تأسيس الشركة",
      description:
        "بدأت شركة معدات تك كفكرة مبتكرة لتسهيل الوصول إلى المعدات الصناعية بتكلفة معقولة.",
    },
    {
      year: "2019",
      title: "توسع الخدمات",
      description:
        "توسعنا لنشمل خدمات التوصيل والصيانة والاستشارات الفنية لتقديم تجربة متكاملة للعملاء.",
    },
    {
      year: "2020",
      title: "إطلاق المنصة الرقمية",
      description:
        "أطلقنا منصة إلكترونية متكاملة لتسهيل عملية حجز وتأجير المعدات عبر الإنترنت.",
    },
    {
      year: "2022",
      title: "التوسع الجغرافي",
      description:
        "افتتاح فروع جديدة في مختلف مناطق المملكة لتسهيل وصول خدماتنا لجميع العملاء.",
    },
    {
      year: "2023",
      title: "إطلاق برنامج الشركاء",
      description:
        "إطلاق برنامج الشركاء لإتاحة الفرصة للشركات والأفراد لتأجير معداتهم عبر منصتنا.",
    },
  ];

  const stats = [
    {
      number: "15+",
      label: "سنوات من الخبرة",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      number: "500+",
      label: "مشروع مكتمل",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    { number: "50+", label: "فريق متخصص", icon: <Users className="w-6 h-6" /> },
    {
      number: "100%",
      label: "رضا العملاء",
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "الجودة",
      description:
        "نلتزم بأعلى معايير الجودة في كل مشروع نقوم به، من التخطيط إلى التنفيذ.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "العمل الجماعي",
      description:
        "نؤمن بقوة العمل الجماعي ونعمل معاً لتحقيق أفضل النتائج لعملائنا.",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "الابتكار",
      description:
        "نستخدم أحدث التقنيات والابتكارات في مجال الإنشاءات لضمان أفضل النتائج.",
    },
  ];

  const teamMembers = [
    {
      name: "أحمد محمد",
      position: "المدير التنفيذي",
      image:
        "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "خبرة 15 عاماً في إدارة المشاريع الإنشائية الكبرى",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "ahmed@company.com",
      },
    },
    {
      name: "المهندسة وعد",
      position: "مديرة المشاريع",
      image:
        "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "متخصصة في إدارة المشاريع الإنشائية وتنسيق الفرق",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "sarah@company.com",
      },
    },
    {
      name: "محمد علي",
      position: "رئيس المهندسين",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "خبرة 12 عاماً في التصميم والتنفيذ الإنشائي",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "mohamed@company.com",
      },
    },
  ];

  // Simple fade-in animation for subtle effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section - Clean and Professional */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              variants={fadeIn}
              className="order-2 lg:order-1"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                من نحن
              </h1>
              <div className="w-24 h-1 bg-yellow-500 mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-8">
                شركة رائدة في مجال الإنشاءات والمقاولات، نقدم حلولاً مبتكرة
                وخدمات عالية الجودة لعملائنا. نحن نفتخر بفريقنا المتميز من
                المهندسين والفنيين الذين يعملون بجد لتحقيق أفضل النتائج.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Stats Highlights - Minimalist Design */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-yellow-500 mb-2">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-800">مشاريع ناجحة</h4>
                  <p className="text-sm text-gray-600">500+ مشروع مكتمل</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-yellow-500 mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-800">فريق متخصص</h4>
                  <p className="text-sm text-gray-600">50+ خبير في المجال</p>
                </div>
              </div>
            </motion.div>

            {/* Image Section - Professional Treatment */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeIn}
              className="order-1 lg:order-2"
            >
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Company Building"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-yellow-500/10"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    خبرة تزيد عن 15 عاماً
                  </h3>
                  <p className="text-gray-200 text-sm">
                    في مجال الإنشاءات والمقاولات
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean & Minimal */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.1 * index }}
                variants={fadeIn}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="text-yellow-500 mb-3">{stat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline - Professional & Clean */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">مسيرتنا</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              تطورنا عبر السنوات لنصبح شركة رائدة في مجال الإنشاءات والمقاولات
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {companyHistory.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                variants={fadeIn}
                className="relative pr-8 pb-12 last:pb-0"
              >
                {/* Timeline Line */}
                {index < companyHistory.length - 1 && (
                  <div className="absolute right-4 top-0 bottom-0 w-px bg-gray-200"></div>
                )}

                {/* Timeline Dot */}
                <div className="absolute right-0 top-1 h-8 w-8 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold">{item.year}</span>
                </div>

                {/* Content */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section - Simple & Professional */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">قيمنا</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              نؤمن بمجموعة من القيم الأساسية التي توجه عملنا وتشكل هويتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                variants={fadeIn}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="text-yellow-500 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Professional Layout */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">فريقنا</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              فريق من المهنيين المتميزين يعملون معاً لتحقيق أفضل النتائج
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                variants={fadeIn}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="flex gap-4">
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors duration-300"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors duration-300"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href={`mailto:${member.social.email}`}
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors duration-300"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-yellow-500 text-sm mb-4">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section - Simple & Effective */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                هل ترغب في التعاون معنا؟
              </h2>
              <p className="text-gray-600 mb-8">
                نحن دائماً متحمسون للعمل مع عملاء جدد وتنفيذ مشاريع مميزة
              </p>
              <Link
                to="/contact"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                تواصل معنا
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
