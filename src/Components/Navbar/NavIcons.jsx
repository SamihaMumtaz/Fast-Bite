import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avarter from "../../assets/productimg/Team/avatar.png";

const NavIcons = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAvatarClick = () => {
    navigate("/login");
  };

  return (
    <div className="hidden md:flex items-center gap-5">
      <img
        src={avarter}
        alt="User Avatar"
        className="w-12 h-12 rounded-full cursor-pointer object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
        onClick={handleAvatarClick}
      />
    </div>
  );
};

export default NavIcons;
