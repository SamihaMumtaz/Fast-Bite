import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import avatarImg from "../../assets/productimg/Team/avatar.png";

const menuData = {
  main: [
    { name: "Home", link: "/" },
    { name: "Food Menu", link: "/food-menu" },
    { name: "Mega Menu", link: "/mega-menu" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ],
};

const Mobile = ({ open, active, setActive, setOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    setIsLoggedIn(!!token);
  }, []);

  const scrollTop = () => window.scrollTo(0, 0);

  const handleClick = (name) => {
    setActive(name);
    scrollTop();
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/logout");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed!");
    }
  };

  return (
    <div
      className={`md:hidden bg-[rgb(255,243,224)] overflow-hidden shadow-md transition-all duration-300 ${
        open ? "max-h-[800px] py-4" : "max-h-0"
      }`}
    >
      <ul className="flex flex-col gap-4 px-4 font-medium">
        {menuData.main.map((item) => (
          <li
            key={item.name}
            className={`cursor-pointer ${
              active === item.name
                ? "text-[rgb(245,130,32)]"
                : "hover:text-[rgb(245,130,32)]"
            }`}
            onClick={() => handleClick(item.name)}
          >
            <Link to={item.link}>{item.name}</Link>
          </li>
        ))}

        <div className="relative mt-3 group mx-auto">
          <img
            src={avatarImg}
            alt="User Avatar"
            className="w-12 h-12 rounded-full cursor-pointer object-cover"
          />
          <ul className="mt-2 bg-white shadow-lg rounded-md py-2 w-40 flex flex-col gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
              <MagnifyingGlassIcon className="w-5" />
              <span>Search</span>
            </li>

            {!isLoggedIn ? (
              <Link to="/login" onClick={() => setOpen(false)}>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">Login</li>
              </Link>
            ) : (
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            )}
          </ul>
        </div>
      </ul>
    </div>
  );
};

export default Mobile;
