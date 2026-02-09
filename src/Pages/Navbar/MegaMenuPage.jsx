import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AllProductData from "../../Data/AllProductData"; // Updated import

const MegaMenuPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Filter only items you want to show in the Mega Menu
    const filteredItems = AllProductData.filter(
      (item) => item.showInMegaMenu // assuming you have this property
    );

    setItems(filteredItems);
  }, []);

  if (!items.length) {
    return (
      <div className="text-center mt-24 text-2xl text-gray-600 font-semibold">
        Loading Menu...
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-6 lg:px-24 bg-[rgb(255,243,224)] min-h-screen mt-22">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center mb-20 text-gray-900 tracking-wider"
      >
        Mega Menu
      </motion.h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ scale: 1.04 }}
            className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white border-2 border-transparent hover:border-[rgb(245,130,32)] transition-all duration-300"
            onClick={() => {
              navigate(`/menu-item/${item._id}`, { state: { item } }); // Detail page will use AllProductDataDetail
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            {/* IMAGE */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={item.img[0]} // Use AllProductData image
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-all duration-300" />

              {/* PRICE */}
              <div className="absolute top-3 right-3 bg-orange-100 text-[rgb(245,130,32)] px-3 py-1 rounded-full font-semibold text-sm shadow-md">
                Rs {item.price}
              </div>

              {/* SPECIAL */}
              {item.specialCategory && (
                <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold text-sm shadow-md">
                  {item.specialCategory}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="px-4 py-4 bg-white">
              <div className="mb-2">
                <span className="bg-orange-100 text-[rgb(245,130,32)] px-2 py-1 rounded-full text-sm font-semibold">
                  {item.mainCategory}
                  {item.subCategory && ` / ${item.subCategory}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-gray-800 font-semibold text-lg sm:text-xl truncate transition-colors duration-300 group-hover:text-[rgb(245,130,32)]">
                  {item.name}
                </h3>

                <button className="bg-[rgb(245,130,32)] text-white px-4 py-1 rounded-full font-semibold">
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenuPage;
