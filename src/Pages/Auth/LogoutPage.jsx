import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import food from "../../assets/productimg/food.png";
import CurvedBG from "../../assets/productimg/curved.png";

const LogoutPage = () => {

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);


  return (
    <div className="min-h-screen relative bg-white pt-28">
      <img src={CurvedBG} className="absolute w-full opacity-60" />
      <img src={food} className="absolute top-0 right-0 w-[300px]" />

      <div className="relative px-10 pt-32">
        <h2 className="text-4xl font-bold">Logged Out</h2>
        <p className="text-gray-600 mt-4">
          You have successfully logged out. Come back soon! 😢
        </p>

        <p className="mt-10 text-lg">
          Go to{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LogoutPage