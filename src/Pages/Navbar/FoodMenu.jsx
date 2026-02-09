import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

const FoodMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dishes");
        setCategories(
          res.data.filter(item => item.type === "Category" && item.showInFoodMenu)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center py-20">Loading food categories...</p>;

  return (
    <div ref={ref} className="w-full py-16 px-6 lg:px-24 bg-[rgb(255,243,224)] min-h-screen mt-20">
      <motion.h2
        initial={{ y: -40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-gray-900 text-center mb-12"
      >
        Explore Our Food Categories
      </motion.h2>

      {categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer h-64"
            >
              {/* Image as background for cleaner overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${item.img?.[0] ? `http://localhost:3000/uploads/${item.img[0]}` : "/placeholder.png"})`,
                }}
              ></div>

              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

              {/* Text */}
              <div className="absolute bottom-4 left-4 z-10 text-white">
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <p className="text-sm">Fresh & delicious</p>
              </div>

              {/* Link overlay */}
              <Link to="/mega-menu" className="absolute inset-0 z-20" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
