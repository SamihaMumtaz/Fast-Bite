import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import ali from "../../assets/productimg/Team/ali.jpg";
import sara from "../../assets/productimg/Team/sara.jpg";
import hamza from "../../assets/productimg/Team/hamza.jpg";
import areeba from "../../assets/productimg/Team/areeba.jpg";

const teamMembers = [
  {
    name: "Ali Khan",
    role: "Founder & CEO",
    image: ali,
    social: { facebook: "#", instagram: "#", twitter: "#" },
  },
  {
    name: "Sara Ahmed",
    role: "Head Chef",
    image: sara,
    social: { facebook: "#", instagram: "#", twitter: "#" },
  },
  {
    name: "Hamza Malik",
    role: "Marketing Manager",
    image: hamza,
    social: { facebook: "#", instagram: "#", twitter: "#" },
  },
  {
    name: "Areeba Shah",
    role: "Customer Support",
    image: areeba,
    social: { facebook: "#", instagram: "#", twitter: "#" },
  },
];

const OurTeamPage = () => {
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
        Our Team
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-orange-400"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
            />
            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-gray-600 mb-4">{member.role}</p>
            <div className="flex gap-4 text-gray-700 text-xl">
              <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
                <FaFacebook />
              </a>
              <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
                <FaInstagram />
              </a>
              <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
                <FaXTwitter />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OurTeamPage;
