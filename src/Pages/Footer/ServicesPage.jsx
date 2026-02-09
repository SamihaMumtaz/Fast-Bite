import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaTruck, FaUtensils, FaSmile, FaClock } from "react-icons/fa";

const services = [
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    description: "Get your meals delivered hot and fresh, right to your doorstep in record time.",
  },
  {
    icon: <FaUtensils />,
    title: "Fresh Meals",
    description: "All our dishes are prepared with fresh ingredients daily, ensuring top quality taste.",
  },
  {
    icon: <FaSmile />,
    title: "Customer Support",
    description: "Our friendly support team is always ready to assist you with orders or queries.",
  },
  {
    icon: <FaClock />,
    title: "24/7 Service",
    description: "Order anytime, anywhere. We are available round the clock to serve your cravings.",
  },
];

const ServicesPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="w-full min-h-screen bg-[rgb(255,243,224)] py-16 px-6 lg:px-24 mt-22"
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-gray-900 text-center mb-12"
      >
        Our Services
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-orange-400 cursor-pointer"
          >
            <div className="text-5xl text-orange-500 mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ServicesPage;
