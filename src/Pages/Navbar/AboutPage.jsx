import React from "react";
import aboutImg from "../../assets/productimg/aboutus.png";
import About from "../../Components/Home/About";
import Choose from "./Choose";

const AboutPage = () => {
  return (
    <div className="w-full">
      <div className="w-full mt-22">
        <About />
      </div>
      <section className="bg-orange-50 py-16 px-6 lg:px-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          To deliver fresh, tasty, and affordable meals with speed and reliability — making every order feel like a premium dining experience. We aim to become the most trusted food delivery brand for families, students, and professionals.
        </p>
      </section>
      <section className="w-full px-6 lg:px-24 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            FastBite is your go-to destination for delicious meals delivered quickly and safely. We bring restaurant-quality food right to your doorstep with unmatched freshness and flavor.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From everyday cravings to special treats, we make sure each meal feels special. Our team works round the clock to provide reliable, fast, and premium delivery services — because your time and taste matter.
          </p>
        </div>
        <div className="flex justify-center">
          <img src={aboutImg} alt="About FastBite" className="w-80 drop-shadow-lg rounded-xl"/>
        </div>
      </section>
      <Choose />
    </div>
  );
};

export default AboutPage;