import React from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation(); 
  const current = location.pathname;

  const linkClasses = (path) =>
    current === path
      ? "text-[rgb(245,130,32)]"       
      : "hover:text-[rgb(245,130,32)]"; 

  const scrollTop = () => window.scrollTo(0, 0);

  return (
    <ul className="hidden md:flex items-center gap-6 font-medium relative text-lg">
      <li className={linkClasses("/")}>
        <Link to="/" onClick={scrollTop}>Home</Link>
      </li>

      <li className={linkClasses("/food-menu")}>
        <Link to="/food-menu" onClick={scrollTop}>Food Menu</Link>
      </li>

      <li className={linkClasses("/mega-menu")}>
        <Link to="/mega-menu" onClick={scrollTop}>Mega Menu</Link>
      </li>

      <li className={linkClasses("/about")}>
        <Link to="/about" onClick={scrollTop}>About</Link>
      </li>

      <li className={linkClasses("/contact")}>
        <Link to="/contact" onClick={scrollTop}>Contact</Link>
      </li>
    </ul>
  );
};

export default Menu;
