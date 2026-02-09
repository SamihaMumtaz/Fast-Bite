import React, { useState } from "react";
import avatar from "../../assets/productimg/Team/avatar.png";
import { HiOutlineSearch, HiOutlineBell, HiOutlineUserCircle, HiOutlineChevronDown } from "react-icons/hi";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 lg:p-6 bg-white shadow-sm border-b gap-4 sm:gap-0">
            {/* Left side - Search Bar (mobile: full width) */}
            <div className="w-full sm:flex-1 sm:max-w-xl">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for items, customers, orders..."
                        className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm lg:text-base"
                    />
                </div>
            </div>

            {/* Right side - Icons and User Profile */}
            <div className="flex items-center gap-4 lg:gap-6 w-full sm:w-auto justify-between sm:justify-normal">
                {/* Notification and Settings */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <HiOutlineBell className="h-6 w-6 text-gray-600" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                {/* User Profile with Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="hidden lg:block text-right">
                                <p className="font-semibold text-gray-800">Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            
                            {/* Profile Image */}
                            <div className="relative">
                                <img
                                    src={avatar}
                                    alt="User Avatar"
                                    className="rounded-full w-10 h-10 lg:w-12 lg:h-12 border-2 border-orange-100 object-cover"
                                />
                            </div>

                            {/* Mobile View */}
                            <div className="lg:hidden flex items-center gap-2">
                                <p className="font-semibold text-sm text-gray-800">Admin</p>
                                <HiOutlineChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                My Profile
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Settings
                            </a>
                            <div className="border-t my-1"></div>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;