import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "You can place an order by visiting our menu page, selecting your items, and clicking 'Order Now'. Follow the checkout instructions to complete your purchase.",
  },
  {
    question: "What are the payment methods available?",
    answer:
      "We accept Cash on Delivery (COD), credit/debit cards, and online payments through our secure payment gateway.",
  },
  {
    question: "Do you offer home delivery?",
    answer:
      "Yes! FastBite delivers fresh meals right to your doorstep. Delivery times may vary based on location.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "You can cancel or modify your order within 10 minutes of placing it by contacting our support team.",
  },
  {
    question: "Are your meals safe and hygienic?",
    answer:
      "Absolutely! We follow strict hygiene standards and prepare meals fresh for every order to ensure quality and safety.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        Frequently Asked Questions
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto space-y-4"
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg border-t-4 border-orange-400 p-6 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
              {openIndex === index ? (
                <FaChevronUp className="text-orange-500 text-lg" />
              ) : (
                <FaChevronDown className="text-orange-500 text-lg" />
              )}
            </div>
            {openIndex === index && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
                className="text-gray-600 mt-4 leading-7"
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FAQPage;
