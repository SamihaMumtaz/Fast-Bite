import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCheck, FiArrowRight, FiStar, FiShoppingCart } from "react-icons/fi";

const BASE_URL = "http://localhost:3000";

const Combo = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const navigate = useNavigate();
  const [comboItems, setComboItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentCombo, setCurrentCombo] = useState(0);

  useEffect(() => {
    const fetchCombo = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${BASE_URL}/api/combo-deals`);
        const combos = response.data || [];
        setComboItems(combos);
        if (combos.length > 1) {
          const interval = setInterval(() => {
            setCurrentCombo((prev) => (prev + 1) % combos.length);
          }, 8000);
          return () => clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load combo deals.");
      } finally {
        setLoading(false);
      }
    };
    fetchCombo();
  }, []);

  const handleOrderNow = (item) => {
    navigate("/ordernow", { state: { selectedItem: item } });
  };

  const calculateDiscount = (price, discountedPrice) => {
    if (!price || !discountedPrice) return 0;
    return Math.round(((price - discountedPrice) / price) * 100);
  };

  const nextCombo = () => {
    setCurrentCombo((prev) => (prev + 1) % comboItems.length);
  };

  const prevCombo = () => {
    setCurrentCombo((prev) => (prev - 1 + comboItems.length) % comboItems.length);
  };

  if (loading) {
    return (
      <section className="w-full min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center bg-white p-6 rounded-xl shadow-md max-w-sm">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl text-red-500">!</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (comboItems.length === 0) {
    return (
      <section className="w-full min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiStar className="text-2xl text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Deals Available</h3>
          <p className="text-gray-600 text-sm max-w-xs">Amazing combo deals are coming soon!</p>
        </div>
      </section>
    );
  }

  const currentItem = comboItems[currentCombo];

  return (
    <section ref={ref} className="w-full py-10 md:py-16 relative overflow-hidden">
      {/* Background Gradient - Simpler */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50"></div>
      
      {/* Smaller Decorative Elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-orange-200 rounded-full -translate-x-20 -translate-y-20 opacity-10"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-200 rounded-full translate-x-20 translate-y-20 opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Compact Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <FiStar className="text-yellow-600 text-sm" />
            SPECIAL OFFER
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Exclusive <span className="text-orange-600">Combo Deal</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-lg mx-auto">
            Limited time offer! Don't miss this amazing deal
          </p>
        </motion.div>

        {/* Compact Combo Card */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentItem._id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Compact Image */}
              <div className="relative h-48 md:h-56 lg:h-auto lg:min-h-[300px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      currentItem.image ? `${BASE_URL}${currentItem.image}` : "/placeholder.png"
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                  
                  {/* Compact Discount Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-lg shadow">
                      <div className="text-xs font-semibold">SAVE</div>
                      <div className="text-xl md:text-2xl font-bold">
                        {calculateDiscount(currentItem.price, currentItem.discountedPrice)}%
                      </div>
                    </div>
                  </div>

                  {/* Compact Featured Badge */}
                  {currentItem.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold text-xs">
                        ⭐ FEATURED
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Compact Content */}
              <div className="p-6 md:p-8">
                {/* Compact Combo Tag */}
                <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  <FiShoppingCart className="text-sm" />
                  COMBO DEAL
                </div>

                {/* Compact Combo Name */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {currentItem.name}
                </h3>

                {/* Compact Description */}
                {currentItem.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {currentItem.description}
                  </p>
                )}

                {/* Compact Items Included */}
                {currentItem.itemsIncluded && currentItem.itemsIncluded.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-800 mb-2">What's Included:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {currentItem.itemsIncluded.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <FiCheck className="text-green-600 text-xs" />
                          </div>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compact Price Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Original</div>
                      <div className="text-lg text-gray-400 line-through">
                        Rs {currentItem.price?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-green-600 mb-1">Discounted</div>
                      <div className="text-2xl md:text-3xl font-bold text-orange-600">
                        Rs {currentItem.discountedPrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">
                    Save Rs {(currentItem.price - currentItem.discountedPrice)?.toLocaleString()}!
                  </div>
                </div>

                {/* Compact Order Button */}
                <div className="mb-6">
                  <button
                    onClick={() => handleOrderNow(currentItem)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                             text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg 
                             transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <FiShoppingCart className="text-base" />
                    <span>Order This Combo Now</span>
                    <FiArrowRight className="text-base" />
                  </button>
                </div>

                {/* Compact Limited Time Warning */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-yellow-600 font-bold text-sm">!</span>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-800 text-xs">Limited Time Offer!</p>
                      <p className="text-yellow-600 text-xs">This deal ends soon.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Compact Combo Navigation */}
          {comboItems.length > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevCombo}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors text-sm"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                  <FiArrowRight className="rotate-180 text-sm" />
                </div>
                <span className="font-medium hidden sm:inline">Previous</span>
              </button>

              {/* Compact Dots Indicator */}
              <div className="flex items-center gap-1">
                {comboItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCombo(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentCombo 
                        ? 'bg-orange-600 w-6' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextCombo}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors text-sm"
              >
                <span className="font-medium hidden sm:inline">Next</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                  <FiArrowRight className="text-sm" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Compact Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-10 md:mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "Above Rs 500" },
              { icon: "⏰", title: "30 Min", desc: "Or free" },
              { icon: "💰", title: "Best Price", desc: "Guaranteed" },
              { icon: "⭐", title: "4.8 Rating", desc: "2000+ customers" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-3">
                <div className="text-2xl mb-1">{item.icon}</div>
                <h4 className="font-semibold text-gray-800 text-sm mb-0.5">{item.title}</h4>
                <p className="text-gray-600 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Combo;