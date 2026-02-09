import React, { useState } from "react";
import axios from "axios";
import contact from "../../assets/productimg/contact.png";
import BottomContact from "./BottomContact";
import { motion, AnimatePresence } from "framer-motion";

const ContactPage = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      message: e.target[3].value,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/contact", data);

      if (res.data.success) {
        setStatusMessage("Message sent successfully!");
        setStatusType("success");
        e.target.reset();
      } else {
        setStatusMessage("Failed to send message!");
        setStatusType("error");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Something went wrong!");
      setStatusType("error");
    }

    setTimeout(() => setStatusMessage(""), 4000);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white px-6 lg:px-24 py-16 mt-22">
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white font-semibold z-50 ${
                statusType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {statusMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              FastBite brings delicious meals to you with speed and care...
            </p>
            <div className="mt-10">
              <motion.img 
                src={contact} 
                alt="contact" 
                className="w-72"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          <motion.form 
            className="bg-white"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-semibold mb-2">E-mail</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full p-3 border border-gray-300 rounded outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                required
              />
            </div>

            <div className="mt-6">
              <label className="block font-semibold mb-2">Message</label>
              <textarea
                rows="5"
                placeholder="Enter Your Message"
                className="w-full p-3 border border-gray-300 rounded outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-transform hover:scale-105"
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>

      <BottomContact />
    </>
  );
};

export default ContactPage;
