import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import NavIcons from "./NavIcons";
import Mobile from "./Mobile";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${ scrolled ? "bg-white shadow-md" : "bg-[rgb(255,243,224)]"}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <Menu />
        <NavIcons />
        <div className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </div>
      </div>
      <Mobile open={open} setOpen={setOpen} />
    </nav>
  );
};

export default Navbar;