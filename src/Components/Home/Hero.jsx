import React, { useState, useEffect } from "react";
import heroImage from "../../assets/productimg/hero.png";
import deliciousImage from "../../assets/productimg/delecious.png";
import menuvideo from "../../assets/videos/menu-video.mp4";

const Hero = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [animateLines, setAnimateLines] = useState([false, false, false, false, false]);

    const openVideo = () => setIsVideoOpen(true);
    const closeVideo = () => setIsVideoOpen(false);

    useEffect(() => {
        animateLines.forEach((_, index) => {
            setTimeout(() => {
                setAnimateLines((prev) => {
                    const newArr = [...prev];
                    newArr[index] = true;
                    return newArr;
                });
            }, index * 500);
        });
    }, []);

    return (
        <section className="relative bg-[rgb(255,243,224)] overflow-hidden pt-20 md:pt-24 lg:pt-28">
            <div className="container mx-auto px-5 md:px-10 lg:px-13 py-10 md:py-16 lg:py-20 pt-20 flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2">
                    <span className={`bg-[rgb(253,228,208)] inline-block px-4 py-2 rounded-full text-base md:text-lg mb-4 transition-all duration-700 ease-out ${animateLines[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ animation: "colorChange 4s infinite" }}>
                        #Special Food 🍇
                    </span>
                    <style>
                        {` @keyframes colorChange { 0% { color: #f97316; } 25% { color: #fb2c36; } 50% { color: #fdc700; } 100% { color: #f97316; } } `}
                    </style>
                    <h1 className={`mb-3 md:mb-4 text-3xl font-bold text-default-950 md:text-5xl/snug lg:text-6xl transition-all duration-700 ${animateLines[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                        We Offer
                    </h1>
                    <h1 className={`mb-3 md:mb-4 text-3xl font-bold capitalize text-default-950 md:text-5xl/snug lg:text-6xl transition-all duration-700 ${animateLines[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                        <span className="inline-block lg:hidden" style={{ backgroundImage: `url(${deliciousImage})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", width: "130px", height: "40px", objectFit: "contain", }}>
                            Delicious
                        </span>
                        <span className="hidden lg:inline-block" style={{ backgroundImage: `url(${deliciousImage})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", width: "260px", height: "80px", objectFit: "contain", }}>
                            Delicious
                        </span> {" "}
                        <span className="text-[rgb(245,130,32)]">Food</span>
                    </h1>
                    <h1 className={`mb-3 md:mb-5 text-3xl font-bold text-default-950 md:text-5xl/snug lg:text-6xl transition-all duration-700 ${animateLines[3] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                        And Quick <br /> Service
                    </h1>
                    <p className={`mx-auto mb-6 md:mb-8 text-base md:text-lg font-medium text-default-700 md:max-w-md lg:mx-0 transition-all duration-700 ${animateLines[4] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                        Imagine you don’t need a diet because we <br /> provide healthy and delicious food for you!
                    </p>
                    <div className="flex flex-wrap gap-3 md:gap-4 items-center">
                        <button onClick={openVideo} className="flex items-center text-primary cursor-pointer">
                            <span className="me-2 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full border-2 border-yellow-400 border-e-transparent">
                                <svg stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                    strokeLinecap="round" strokeLinejoin="round" height="20" width="20"
                                >
                                    <polygon
                                        points="5 3 19 12 5 21 5 3"
                                        className="fill-orange-500 stroke-none"
                                    ></polygon>
                                </svg>
                            </span>
                            <span className="font-semibold text-orange-500 text-sm md:text-base">See Our Dishes</span>
                        </button>
                    </div>
                </div>
                <div
                    className={`lg:w-1/2 mt-10 lg:mt-0 relative transition-all duration-1000 
                    ${animateLines[4] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                >
                    <img src={heroImage} alt="Delicious Food" className="w-full relative z-10" />

                    <div className="absolute top-5 right-5 md:top-10 md:right-10 w-8 h-8 md:w-12 md:h-12 bg-yellow-400 rounded-lg z-0 animate-bounce"></div>
                    <div className="absolute top-10 left-10 md:top-20 md:left-20 w-4 h-4 md:w-6 md:h-6 bg-orange-300 rounded-full z-0 animate-pulse"></div>
                </div>
            </div>

            {isVideoOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm cursor-pointer"
                    onClick={closeVideo}
                >
                    <div className="relative cursor-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeVideo}
                            className="absolute top-0 right-0 text-white text-2xl font-bold z-10"
                        >
                            &times;
                        </button>

                        <video
                            src={menuvideo}
                            controls
                            autoPlay
                            className="rounded-lg max-w-full max-h-[80vh]"
                        ></video>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Hero;
