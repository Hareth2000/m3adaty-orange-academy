import React, { useState, useEffect } from "react";
import { Star, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/testimonials/approved"
      );
      setTestimonials(response.data.slice(0, 6)); // عرض أول 6 فقط
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/testimonials", formData, {
        withCredentials: true,
      });
      setShowForm(false);
      setFormData({ name: "", role: "", company: "", content: "", rating: 5 });
      fetchTestimonials();
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-lg text-[#616161] max-w-2xl mx-auto leading-relaxed">
            نفتخر برضا عملائنا ونعمل باستمرار على تحسين خدماتنا
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-[#F6F4F4] rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img
                        src={testimonial.image || "/user.png"}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#FFB800] shadow-md"
                      />
                      <div className="mr-4">
                        <h4 className="font-bold text-[#1A1A1A] text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-[#616161]">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating
                              ? "text-[#FFB800] fill-[#FFB800]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#616161] mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[#1A1A1A] font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-16">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/testimonials"
              className="inline-block bg-yellow-400 text-[#1A1A1A] px-6 py-3 rounded-xl hover:bg-yellow-500 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
            >
              المزيد من الآراء
            </Link>
          </motion.div>
        </div>

        {/* نموذج إضافة رأي جديد */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl w-full max-w-lg mx-4 relative shadow-2xl flex flex-col max-h-[90vh]"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowForm(false)}
                className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 p-2 rounded-full hover:bg-gray-200 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-8 text-center mt-2">
                أضف رأيك
              </h3>
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto px-1 space-y-6 pb-32"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-[#1A1A1A] font-medium mb-2">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] focus:outline-none transition-all duration-300"
                      placeholder="أدخل اسمك"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-[#1A1A1A] font-medium mb-2">
                      المنصب
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] focus:outline-none transition-all duration-300"
                      placeholder="أدخل منصبك"
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-[#1A1A1A] font-medium mb-2">
                    الشركة
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] focus:outline-none transition-all duration-300"
                    placeholder="أدخل اسم الشركة"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-[#1A1A1A] font-medium mb-2">
                    التقييم
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, rating: star }))
                        }
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= formData.rating
                              ? "text-[#FFB800] fill-[#FFB800]"
                              : "text-gray-300"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-[#1A1A1A] font-medium mb-2">
                    الرأي
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] focus:outline-none transition-all duration-300 resize-none"
                    placeholder="اكتب رأيك هنا..."
                  />
                </motion.div>
              </form>
              <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-center gap-4 py-4 px-6 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium min-w-[120px]"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  form="testimonial-form"
                  className="px-8 py-3 bg-[#FFB800] text-[#1A1A1A] rounded-xl hover:bg-[#E5A700] transition-all duration-300 font-bold shadow-lg hover:shadow-xl min-w-[120px]"
                >
                  إرسال
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
