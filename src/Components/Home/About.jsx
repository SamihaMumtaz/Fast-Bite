import React, { useState, useEffect, useRef } from "react";
import aboutImg from "../../assets/productimg/about.png";
import founder from "../../assets/productimg/Team/ali.jpg"
import { ShoppingBagIcon, HeartIcon, TruckIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const About = () => {

    const [animate, setAnimate] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setAnimate(true);
                    } else {
                        setAnimate(false);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-20">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">

                <div
                    className={`lg:w-1/2 flex justify-center bg-[rgb(247,248,249)] rounded-xl
                        transition-all duration-700 ease-out
                        ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                >
                    <img
                        src={aboutImg}
                        alt="food"
                        className="w-full max-w-xl object-cover"
                    />
                </div>

                <div
                    className={`lg:w-1/2 transition-all duration-700 ease-out delay-200
                        ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                >

                    <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <button className="bg-orange-100 text-orange-500 px-5 py-1 rounded-full font-medium mb-4">
                            About Us
                        </button>
                    </Link>

                    <h2 className="mb-6 max-w-xl text-3xl font-semibold text-default-900 animate-fadeUp">
                        Fast, Fresh & Delivered <br /> Straight to Your Doorstep.
                    </h2>

                    <p className="mb-16 max-w-2xl font-medium text-default-500 xl:mb-20 animate-fadeUp delay-100">
                        We bring your favorite meals right to you — hot, fresh, and full of flavor.
                        From quick snacks to full meals, our delivery ensures top-quality food prepared
                        with care and delivered with speed.
                    </p>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="shadow-md p-6 rounded-xl border border-transparent hover:border-orange-400 transition-all duration-500 animate-card">
                            <ShoppingBagIcon className="w-10 h-10 text-orange-500 mb-3" />
                            <h3 className="font-bold text-lg mb-2">Fresh Meals</h3>
                            <p className="text-gray-500 text-sm">Every dish is prepared with premium ingredients.</p>
                        </div>
                        <div className="shadow-md p-6 rounded-xl border border-transparent hover:border-orange-400 transition-all duration-500 animate-card delay-100">
                            <HeartIcon className="w-10 h-10 text-orange-500 mb-3" />
                            <h3 className="font-bold text-lg mb-2">Healthy Option</h3>
                            <p className="text-gray-500 text-sm">Choose from a range of nutritious meal selections.</p>
                        </div>
                        <div className="shadow-md p-6 rounded-xl border border-transparent hover:border-orange-400 transition-all duration-500 animate-card delay-200">
                            <TruckIcon className="w-10 h-10 text-orange-500 mb-3" />
                            <h3 className="font-bold text-lg mb-2">Quick Delivery</h3>
                            <p className="text-gray-500 text-sm">Fast and reliable delivery right to your door.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-10 animate-fadeUp delay-300">
                        <img
                            src={founder}
                            className="w-14 h-14 rounded-full"
                            alt="founder"
                        />
                        <div>
                            <h4 className="font-bold text-gray-800">Marley Culhane</h4>
                            <p className="text-gray-500 text-sm">Founder CEO</p>
                        </div>
                    </div>

                </div>
            </div>

            <style>
                {`
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.8s ease-out forwards;
                }

                @keyframes cardPop {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-card {
                    animation: cardPop 0.8s ease-out forwards;
                }
                `}
            </style>
        </section>
    )
}

export default About