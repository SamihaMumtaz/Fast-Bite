import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import AllProductData from "../Data/AllProductData";

const AllProductDataDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState("");

  // Scroll to top on page load
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find the item from AllProductData
  useEffect(() => {
    const found = AllProductData.find(
      (i) => i.type === "Item" && i._id.toString() === id
    );
    if (found) {
      setItem(found);
      setMainImage(found.img?.[0] || "");
    }
  }, [id]);

  if (!item) return <h1 className="text-center text-3xl mt-20">Item Not Found</h1>;

  const galleryImages = item.img?.length ? item.img : [];

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row gap-12 px-6 lg:px-16 py-10 bg-white mt-24">
      <div className="w-full lg:w-1/2">
        <img
          src={mainImage}
          alt={item.name}
          className="w-full h-[400px] object-cover rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
        />

        <div className="flex gap-4 mt-6 flex-wrap">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              onClick={() => setMainImage(img)}
              className={`w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                mainImage === img
                  ? "border-orange-500 shadow-lg"
                  : "border-gray-300 hover:shadow-md"
              }`}
            >
              <img
                src={img}
                alt={`${item.name}-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-gray-800">{item.name}</h1>
          <p className="text-3xl font-semibold text-orange-500">Rs {item.price}</p>
        </div>

        <p className="text-gray-500 text-sm">by Healthy Feast Corner</p>

        <div className="flex items-center gap-2 mt-2">
          {Array(5)
            .fill()
            .map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
          <span className="text-gray-500 text-sm ml-2">231 Reviews</span>
        </div>

        <p className="text-gray-600 mt-4 leading-7">
          Experience the perfect blend of flavors with our freshly made <strong className="text-orange-500">{item.name}</strong>. 
          Prepared with the finest ingredients, every bite offers a delightful taste that will leave 
          you craving more. Ideal for a hearty meal or a quick snack, it's a treat for your taste buds. 
          Enjoy it hot and fresh, just the way it’s meant to be served.
        </p>

        <button
          onClick={() =>
            navigate("/ordernow", { state: { selectedItem: item } })
          }
          className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-xl mt-4 text-lg font-semibold cursor-pointer transition-colors duration-300"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default AllProductDataDetail;
