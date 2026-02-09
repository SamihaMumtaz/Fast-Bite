import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import Dashboard from "../../Pages/Admin/Dashboard";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import OrdersPage from "../../Pages/Admin/OrdersPage";
import Customer from "../../Pages/Admin/Customer";
import Sellers from "../../Pages/Admin/Sellers";
import SubscribersPage from "../../Pages/Admin/SubscribersPage";
import ContactPage from "../../Pages/Admin/ContactPage";
import DishesPage from "../../Pages/Admin/DishesPage";
import MenuItems from "../../Pages/Admin/MenuItems";
import ComboDeals from "../../Pages/Admin/ComboDeals";


const DashboardRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />              
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<Customer />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="subscriber" element={<SubscribersPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="dishes" element={<DishesPage />} />
        <Route path="menuitems" element={<MenuItems />} />
        <Route path="combodeal" element={<ComboDeals />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
