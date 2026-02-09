import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaDownload, 
  FaStar, 
  FaFire,
  FaClock,
  FaMotorcycle 
} from "react-icons/fa";
import { GiChicken, GiPizzaSlice, GiHamburger, GiCupcake } from "react-icons/gi";
import richard from "../../assets/productimg/Team/hamza.jpg";
import areeba from "../../assets/productimg/Team/areeba.jpg";
import fastest from "../../assets/productimg/fastest.png";
import vegburger from "../../assets/productimg/vegburger.jpeg";
import chickenwrap from "../../assets/productimg/chickenwrap.jpeg";

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const popularItems = [
    { name: "Veg Burger", price: "Rs 450", image: vegburger, rating: 4.8 },
    { name: "Chicken Wrap", price: "Rs 550", image: chickenwrap, rating: 4.9 },
    { name: "BBQ Pizza", price: "Rs 1200", image: vegburger, rating: 4.7 },
    { name: "Chocolate Shake", price: "Rs 350", image: chickenwrap, rating: 4.6 }
  ];

  const categories = [
    { name: "Pizza", icon: <GiPizzaSlice />, color: "bg-red-100 text-red-600" },
    { name: "Burger", icon: <GiHamburger />, color: "bg-orange-100 text-orange-600" },
    { name: "Chicken", icon: <GiChicken />, color: "bg-yellow-100 text-yellow-600" },
    { name: "Desserts", icon: <GiCupcake />, color: "bg-pink-100 text-pink-600" }
  ];

  return (
    <section className="w-full py-20 md:py-28 px-4 md:px-8 lg:px-16 relative overflow-hidden mt-26">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full -translate-x-36 -translate-y-36 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full translate-x-48 translate-y-48 opacity-20"></div>
      
      {/* Animated Emojis */}
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={isInView ? { y: [0, -15, 0], opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-4xl hidden md:block"
      >
        🍔
      </motion.span>

      <motion.span
        initial={{ y: 0, opacity: 0 }}
        animate={isInView ? { y: [-10, 0, -10], opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute top-40 right-20 text-3xl hidden md:block"
      >
        🍕
      </motion.span>

      <motion.span
        initial={{ y: 0, opacity: 0 }}
        animate={isInView ? { y: [0, 15, 0], opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-40 left-32 text-3xl hidden md:block"
      >
        🥤
      </motion.span>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
              <FaDownload className="text-lg" />
              <span>Download Our App</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Craving Delicious
              <span className="text-orange-600 block">Food? We Deliver!</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg">
              Order your favorite meals from top restaurants and get them 
              delivered to your doorstep in minutes. Fast, fresh, and delicious!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">30<span className="text-lg">min</span></div>
                <div className="text-sm text-gray-500 mt-1">Avg Delivery</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">4.8<span className="text-lg text-yellow-500">★</span></div>
                <div className="text-sm text-gray-500 mt-1">Customer Rating</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">500<span className="text-lg">+</span></div>
                <div className="text-sm text-gray-500 mt-1">Restaurants</div>
              </div>
            </div>

            {/* Courier Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md border border-orange-100"
            >
              <div className="flex items-center gap-4">
                {/* Courier Image */}
                <div className="relative">
                  <img
                    src={richard}
                    alt="Courier"
                    className="w-16 h-16 rounded-full border-4 border-orange-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <FaMotorcycle className="text-white text-xs" />
                  </div>
                </div>

                {/* Courier Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">Richard Watson</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span>4.9 Rating • 2000+ Deliveries</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <FaClock className="inline mr-1" /> Online
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      <FaFire className="inline mr-1" /> Fast Delivery
                    </span>
                  </div>
                </div>

                {/* Call Button */}
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <FaPhone className="text-lg" />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery to</p>
                    <p className="font-semibold text-gray-900">Pakistan</p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={areeba}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-orange-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              {/* Fast Delivery Card */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white mb-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Lightning Fast Delivery</h3>
                      <p className="text-orange-100 text-sm">Average delivery time</p>
                      <div className="text-3xl font-bold mt-2">25-30<span className="text-lg">min</span></div>
                    </div>
                    <div className="w-24">
                      <img
                        src={fastest}
                        alt="Delivery Scooter"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`${category.color} flex flex-col items-center justify-center p-3 rounded-xl hover:scale-105 transition-transform`}
                    >
                      <span className="text-2xl mb-2">{category.icon}</span>
                      <span className="text-xs font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">🔥 Popular Now</h3>
                  <button className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">
                    View All →
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {popularItems.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="relative mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          {item.rating}
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-orange-600 font-bold text-sm mt-1">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Now Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-gray-900 to-black text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]">
                  Order Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;