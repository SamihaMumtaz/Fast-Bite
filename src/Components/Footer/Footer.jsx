import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FaPhoneAlt, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubscribe = async () => {
        if (!email) {
            setMessage("Please enter an email!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/subscribe", { email });

            if (res.status === 201) {
                setMessage("Subscribed successfully!");
                setEmail("");
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Something went wrong!");
            }
        }

        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <motion.footer
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white pt-12 pb-6 border-t mt-20"
        >
            <div className="container mx-auto px-6 md:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-10"
                >
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link to="/about" className="hover:text-orange-500 transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="hover:text-orange-500 transition">
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link to="/team" className="hover:text-orange-500 transition">
                                    Our Team
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-orange-500 transition">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link to="/help" className="hover:text-orange-500 transition">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-orange-500 transition">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Get in touch</h3>
                        <p className="text-gray-600">( +123 ) 456 789 123</p>
                        <p className="text-gray-600 mt-1">support@fastbite.com</p>

                        <div className="flex items-center gap-4 text-gray-700 mt-4 text-xl">
                            <FaPhoneAlt />
                            <FaFacebook />
                            <FaInstagram />
                            <FaXTwitter />
                        </div>
                    </div>

                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 40 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-100"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Subscribe</h3>

                            <div className="flex shadow-md rounded-lg overflow-hidden bg-white">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="px-4 py-2 w-full outline-none"
                                />
                                <button
                                    onClick={handleSubscribe}
                                    className="bg-orange-500 text-white px-5 text-lg font-semibold cursor-pointer"
                                >
                                    →
                                </button>
                            </div>

                            {message && <p className="text-sm text-green-600 mt-2">{message}</p>}

                            <p className="text-gray-600 text-sm mt-4">
                                Join FastBite and get fresh offers, sizzling deals and foodie updates in your inbox.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center text-gray-600 text-sm mt-16 pt-6 border-t"
                >
                    © {new Date().getFullYear()} FastBite — delivering flavor and joy at your doorstep.
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
