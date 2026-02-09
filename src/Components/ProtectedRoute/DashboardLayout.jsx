import React from "react";
import Sidebar from "../../Pages/Admin/Sidebar";
import Navbar from "../../Pages/Admin/Navbar";
import Footer from "../../Pages/Admin/Footer";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 flex-1">
          <Outlet /> 
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
