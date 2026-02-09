import React from 'react';
import logo from "../../assets/productimg/logo.png";

const Logo = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
    window.location.href = '/';
  };

  return (
    <div className="flex justify-center items-center pt-2">
      <img
        src={logo}
        alt="logo"
        className="cursor-pointer h-15"
        onClick={handleClick}
      />
    </div>
  );
};

export default Logo;
