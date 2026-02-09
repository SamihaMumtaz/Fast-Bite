import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShoppingCart, 
  Users, 
  Package, 
  ChefHat, 
  Mail, 
  Phone,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);

  const API_BASE_URL = "http://localhost:3000/api";

  const fetchSafe = async (endpoint, setter) => {
    try {
      const res = await axios.get(`${API_BASE_URL}${endpoint}`);
      setter(res.data || []);
    } catch (error) {
      console.warn(`API failed → ${endpoint}`, error.message);
      setter([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSafe("/orders", setOrders),
          fetchSafe("/menu-items", setMenuItems),
          fetchSafe("/customers", setCustomers),
          fetchSafe("/dishes", setDishes),
          fetchSafe("/sellers", setSellers),
          fetchSafe("/subscribe", setSubscribers),
          fetchSafe("/contact", setContacts),
          fetchSafe("/categories", setCategories),
        ]);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalMenuItems = menuItems.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  
  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  // Get popular dishes
  const popularDishes = [...dishes]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 4);

  // Get recent contacts (last 3)
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">Rs {totalRevenue.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                12% increase
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-green-600 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {completedOrders} completed
                </span>
                <span className="text-yellow-600 text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pendingOrders} pending
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalCustomers}</p>
              <p className="text-purple-600 text-sm mt-1 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Active users
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Menu Items Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Menu Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalMenuItems}</p>
              <p className="text-orange-600 text-sm mt-1 flex items-center">
                <ChefHat className="w-4 h-4 mr-1" />
                Dishes available
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <a href="/dashboard/orders" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View all →
            </a>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Order ID</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Customer</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <span className="font-medium text-gray-900">#{order.orderId || order._id?.slice(-6)}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-gray-900">{order.customerName || "N/A"}</div>
                        <div className="text-gray-500 text-sm">{order.email || order.phone || ""}</div>
                      </td>
                      <td className="p-3 font-medium text-gray-900">
                        Rs {order.total?.toLocaleString() || "0"}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {order.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {order.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500 text-sm">
                        {new Date(order.createdAt || order.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent orders found</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Popular Dishes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Dishes</h3>
            {popularDishes.length > 0 ? (
              <div className="space-y-4">
                {popularDishes.map((dish) => (
                  <div key={dish._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    {dish.image && (
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{dish.name}</p>
                      <p className="text-sm text-gray-500">Rs {dish.price?.toLocaleString()}</p>
                    </div>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {dish.orders || 0} orders
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No dish data available</p>
            )}
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Contacts</h3>
              <a href="/dashboard/contacts" className="text-orange-600 hover:text-orange-700 text-sm">
                View all
              </a>
            </div>
            {recentContacts.length > 0 ? (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(contact.createdAt || contact.date).toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            contact.status === 'read' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {contact.status || 'unread'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent contacts</p>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sellers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-full">
              <ChefHat className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sellers</h3>
              <p className="text-2xl font-bold mt-1">{sellers.length}</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">Registered vendors and sellers</p>
        </div>

        {/* Subscribers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-100 p-2 rounded-full">
              <Mail className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Subscribers</h3>
              <p className="text-2xl font-bold mt-1">{subscribers.length}</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">Newsletter subscribers</p>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-100 p-2 rounded-full">
              <Package className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <p className="text-2xl font-bold mt-1">{categories.length}</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">Food categories available</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a href="/dashboard/menuitems" className="p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors text-center">
            <Package className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">Add Menu Item</span>
          </a>
          <a href="/dashboard/orders" className="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-center">
            <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">View Orders</span>
          </a>
          <a href="/dashboard/customers" className="p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">Manage Customers</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;