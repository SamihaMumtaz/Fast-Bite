import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import AllProductData from "../../Data/AllProductData";

const SpecialMenu = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const categories = [
    { icon: "🥐", label: "Bakery" },
    { icon: "🍖", label: "BBQ" },
    { icon: "🧁", label: "Desserts" },
    { icon: "🥤", label: "Drinks" },
    { icon: "🍔", label: "Food Items" },
    { icon: "🥛", label: "Shakes" },
    { icon: "🍟", label: "Snacks" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);

  const filteredItems = AllProductData.filter(
    (item) =>
      item.type === "Item" &&
      item.showInSpecial === true &&
      item.subCategory === selectedCategory
  );

  const items =
    filteredItems.length > 0
      ? [...filteredItems, ...filteredItems, ...filteredItems]
      : [];

  const settings = {
    dots: false,
    infinite: items.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 w-full">
      <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-10">

        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <h2 className="text-2xl font-semibold mb-6 text-center lg:text-left">
            Special Menu for you...
          </h2>

          <div className="flex flex-col gap-4 md:gap-6 max-h-[350px] overflow-y-auto pr-2 lg:pr-3 [scrollbar-color:orange_transparent] [scrollbar-width:thin]">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`flex items-center gap-4 px-3 py-2 rounded-full cursor-pointer font-semibold transition-all duration-300 ${
                  selectedCategory === cat.label
                    ? "bg-[rgb(245,130,32)] text-white w-auto max-w-[180px]"
                    : "hover:text-[rgb(245,130,32)] w-auto max-w-[180px]"
                }`}
                onClick={() => setSelectedCategory(cat.label)}
              >
                <span
                  className={`text-3xl p-2 rounded-full transition-all duration-300 ${
                    selectedCategory === cat.label
                      ? "bg-white text-[rgb(245,130,32)]"
                      : "bg-white"
                  }`}
                >
                  {cat.icon}
                </span>
                <span className="text-lg truncate">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="w-full lg:w-3/4 relative mt-8 lg:mt-0">
          <div className="flex justify-end mb-4 gap-2">
            <button
              onClick={() => sliderRef.current.slickPrev()}
              className="bg-[rgb(245,130,32)] text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => sliderRef.current.slickNext()}
              className="bg-[rgb(245,130,32)] text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl"
            >
              <FiChevronRight />
            </button>
          </div>

          <div className="bg-[rgb(254,242,232)] p-4 rounded-3xl">
            <Slider {...settings} ref={sliderRef}>
              {items.map((item, index) => (
                <div key={`${item._id}-${index}`} className="px-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleItemClick(item._id)}
                    className="relative rounded-3xl overflow-hidden cursor-pointer h-[320px] sm:h-[350px] md:h-[380px] group"
                  >
                    <img
                      src={item.img[0]}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-3xl transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 rounded-3xl"></div>
                    <p className="absolute top-4 right-4 bg-orange-100 text-[rgb(245,130,32)] px-4 py-1 rounded-full font-semibold shadow-md text-sm sm:text-base transition-all duration-300 group-hover:scale-105">
                      Rs {item.price}
                    </p>
                    <h3 className="absolute bottom-4 left-4 text-white group-hover:text-[rgb(245,130,32)] text-lg md:text-xl font-semibold transition-colors duration-300">
                      {item.name}
                    </h3>
                  </motion.div>
                </div>
              ))}
            </Slider>

            {filteredItems.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                No items available in this category
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialMenu;
