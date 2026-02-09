import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const HelpPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="w-full min-h-screen bg-[rgb(255,243,224)] py-16 px-6 lg:px-24 mt-22" ref={ref}>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-gray-900 text-center mb-12"
      >
        Help Center
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {[
          {
            question: "How do I place an order?",
            answer:
              "Browse our menu, select the item, choose size or quantity, and click 'Order Now'. You can pay online or on delivery.",
          },
          {
            question: "What are the payment methods?",
            answer:
              "We accept Cash on Delivery, Credit/Debit Cards, and online wallets. Safe & secure transactions guaranteed.",
          },
          {
            question: "Can I track my order?",
            answer:
              "Yes! After placing an order, you will get a tracking link and SMS notifications about your order status.",
          },
          {
            question: "What is the delivery time?",
            answer:
              "Delivery usually takes 30-60 minutes depending on location. We ensure fresh and hot meals reach you fast.",
          },
          {
            question: "How can I cancel or modify an order?",
            answer:
              "You can cancel or modify your order within 10 minutes of placing it by contacting our support via phone or email.",
          },
        ].map((faq, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-400"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
            <p className="text-gray-600 leading-7">{faq.answer}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-5xl mx-auto mt-12 p-6 bg-orange-50 rounded-2xl text-center shadow-md"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Need More Help?</h2>
        <p className="text-gray-700 mb-4">
          Contact our support team for any questions, order issues, or assistance.
        </p>
        <p className="text-gray-700 mb-2">Phone: ( +123 ) 456 789 123</p>
        <p className="text-gray-700">Email: support@fastbite.com</p>
      </motion.div>
    </div>
  );
};

export default HelpPage;
