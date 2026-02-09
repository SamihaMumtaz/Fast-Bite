import React from "react";
import { HiOutlineChip, HiOutlineRefresh } from "react-icons/hi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // System status (آپ actual data سے replace کر سکتے ہیں)
  const getStatusColor = () => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) return "text-green-500";
    return "text-blue-500";
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 py-2">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          
          {/* Left Section - Brand and Status */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              <HiOutlineChip className="h-3 w-3" />
              <span className="text-xs font-medium">System Online</span>
            </div>
            
            <span className="text-gray-300 hidden sm:inline">|</span>
            
            <div className="hidden sm:flex items-center gap-1 text-gray-500">
              <HiOutlineRefresh className="h-3 w-3" />
              <span className="text-xs">Auto-refresh: 30s</span>
            </div>
          </div>

          {/* Center Section - Copyright */}
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              © {currentYear} <span className="font-semibold text-orange-500">FastBite</span> Admin Panel
              <span className="hidden sm:inline"> • v2.1.4</span>
            </p>
          </div>

          {/* Right Section - Time and Actions */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs hidden sm:block">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-xs">
                {new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            
            <button 
              className="text-gray-400 hover:text-orange-500 transition-colors"
              title="Refresh data"
            >
              <HiOutlineRefresh className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Only - Extra Info */}
        <div className="sm:hidden mt-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">
              Version 2.1.4
            </span>
            <span className="text-gray-400 text-xs">
              Auto-refresh: 30s
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;