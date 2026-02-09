import {
  HiOutlineHome,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineShoppingCart,
  HiOutlineUserGroup,
  HiOutlineRectangleGroup,
  HiOutlineBriefcase,
  HiOutlineEnvelopeOpen,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/productimg/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm ${
      isActive
        ? "bg-orange-50 border-r-4 border-orange-500 text-orange-600 font-semibold"
        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 lg:w-68 bg-white h-screen shadow-lg p-4 lg:p-5 fixed left-0 top-0 z-40 flex flex-col">
      {/* Logo Section */}
      <div className="px-2 mb-6 lg:mb-7">
        <img 
          src={logo} 
          alt="logo" 
          className="h-9 lg:h-10 w-auto object-contain" 
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-2 flex-1 overflow-y-auto">
        <NavLink to="/dashboard" end className={linkClass}>
          <HiOutlineHome className="w-5 h-5" /> 
          <span className="text-sm">Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/menuitems" className={linkClass}>
          <HiOutlineAdjustmentsHorizontal className="w-5 h-5" /> 
          <span className="text-sm">Menu Items</span>
        </NavLink>

        <NavLink to="/dashboard/orders" className={linkClass}>
          <HiOutlineShoppingCart className="w-5 h-5" /> 
          <span className="text-sm">Orders</span>
        </NavLink>

        <NavLink to="/dashboard/customers" className={linkClass}>
          <HiOutlineUserGroup className="w-5 h-5" /> 
          <span className="text-sm">Customers</span>
        </NavLink>

        <NavLink to="/dashboard/dishes" className={linkClass}>
          <HiOutlineRectangleGroup className="w-5 h-5" /> 
          <span className="text-sm">Dishes</span>
        </NavLink>

        <NavLink to="/dashboard/sellers" className={linkClass}>
          <HiOutlineBriefcase className="w-5 h-5" /> 
          <span className="text-sm">Sellers</span>
        </NavLink>

        <NavLink to="/dashboard/subscriber" className={linkClass}>
          <HiOutlineEnvelopeOpen className="w-5 h-5" /> 
          <span className="text-sm">Subscribers</span>
        </NavLink>

        <NavLink to="/dashboard/contact" className={linkClass}>
          <HiOutlineChatBubbleOvalLeft className="w-5 h-5" /> 
          <span className="text-sm">Contact Messages</span>
        </NavLink>

        {/* Combo Deal */}
        <NavLink to="/dashboard/combodeal" className={linkClass}>
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-xs font-bold">CD</span>
          </div>
          <span className="text-sm">Combo Deal</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-100 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center justify-start gap-3 w-full p-3 rounded-lg text-orange-500 font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 cursor-pointer text-sm"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" /> 
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;