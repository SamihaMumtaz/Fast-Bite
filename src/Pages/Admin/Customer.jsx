import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiUsers, 
  FiMail, 
  FiPhone, 
  FiShoppingBag, 
  FiCalendar, 
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiX,
  FiUser,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Reduced to 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [customersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3000/api/customers"),
        axios.get("http://localhost:3000/api/orders")
      ]);

      let existingCustomers = customersRes.data || [];
      const allOrders = ordersRes.data || [];

      // Sync customers from orders
      for (let order of allOrders) {
        if (order.billing && order.billing.email) {
          const exists = existingCustomers.find(c => c.email === order.billing.email);
          if (!exists) {
            const newCustomer = {
              name: `${order.billing.firstName || ''} ${order.billing.lastName || ''}`.trim() || "Unknown Customer",
              email: order.billing.email,
              phone: order.billing.phone || "N/A",
              status: "Active",
              since: new Date()
            };
            try {
              await axios.post("http://localhost:3000/api/customers", newCustomer);
              existingCustomers.push(newCustomer);
            } catch (err) {
              console.error("Failed to add customer:", err);
            }
          }
        }
      }

      // Remove customers with no orders
      for (let customer of existingCustomers) {
        const customerOrders = allOrders.filter(o => o.billing?.email === customer.email);
        if (customerOrders.length === 0) {
          try {
            await axios.delete(`http://localhost:3000/api/customers/${customer._id}`);
          } catch (err) {
            console.error("Failed to delete customer:", err);
          }
        }
      }

      existingCustomers = existingCustomers.filter(c =>
        allOrders.some(o => o.billing?.email === c.email)
      );

      setCustomers(existingCustomers);
      setOrders(allOrders);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load customers. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const searchMatch = searchTerm === "" || 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    
    const statusMatch = statusFilter === "all" || customer.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Get customer statistics
  const customerOrders = (email) => orders.filter(o => o.billing?.email === email);
  const customerTotalSpent = (email) => {
    return customerOrders(email).reduce((sum, order) => sum + (order.price || 0), 0);
  };

  // Sort customers by total spent (descending)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => 
    customerTotalSpent(b.email) - customerTotalSpent(a.email)
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE));
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const totalRevenue = customers.reduce((sum, customer) => 
    sum + customerTotalSpent(customer.email), 0
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Customers</h1>
            <p className="text-gray-600 text-sm">Manage and view customer information</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={fetchData}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm text-sm flex-1 md:flex-none"
            >
              <FiRefreshCw className="text-base" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
              <p className="text-gray-500 text-xs mt-1">
                {activeCustomers} active
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiUsers className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeCustomers}</p>
              <p className="text-gray-500 text-xs mt-1">
                {totalCustomers > 0 
                  ? `${Math.round((activeCustomers / totalCustomers) * 100)}% of total`
                  : "0%"}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiCheckCircle className="text-lg text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                Rs {totalRevenue.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                From all customers
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <FiDollarSign className="text-lg text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiX className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Error Loading</h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUser className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Customers</h3>
            <p className="text-gray-500 text-sm mb-4">Customers will appear here when they place orders</p>
            <button
              onClick={fetchData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiSearch className="text-xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Results</h3>
            <p className="text-gray-500 text-sm mb-4">No customers match your search</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Member Since
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCustomers.map(customer => {
                      const ordersCount = customerOrders(customer.email).length;
                      const totalSpent = customerTotalSpent(customer.email);
                      
                      return (
                        <tr key={customer._id || customer.email} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-2">
                                <FiUser className="text-sm text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                                <p className="text-gray-500 text-xs">ID: {customer._id?.substring(0, 6) || "N/A"}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <FiMail className="text-gray-400 mr-1" size={12} />
                                <a 
                                  href={`mailto:${customer.email}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[120px]"
                                >
                                  {customer.email}
                                </a>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <FiPhone className="text-gray-400 mr-1" size={12} />
                                <span className="truncate max-w-[100px]">{customer.phone || "N/A"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100">
                                <FiShoppingBag className="text-blue-600 mr-1" size={12} />
                                <span className="font-semibold text-blue-700 text-xs">
                                  {ordersCount}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-green-700 text-sm">
                              Rs {totalSpent.toLocaleString()}
                            </div>
                            {ordersCount > 0 && (
                              <div className="text-xs text-gray-500">
                                Avg: Rs {(totalSpent / ordersCount).toFixed(0)}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-600">
                              {formatDate(customer.since)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              customer.status === "Active" 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.status === "Active" ? (
                                <>
                                  <FiCheckCircle className="mr-1" size={12} />
                                  Active
                                </>
                              ) : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-100">
                {paginatedCustomers.map(customer => {
                  const ordersCount = customerOrders(customer.email).length;
                  const totalSpent = customerTotalSpent(customer.email);
                  
                  return (
                    <div key={customer._id || customer.email} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                            <FiUser className="text-sm text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm truncate">{customer.name}</h3>
                            <div className="flex items-center mt-0.5">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.status === "Active" 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {customer.status}
                              </span>
                              <div className="ml-1 inline-flex items-center px-1 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100">
                                <FiShoppingBag className="text-blue-600" size={8} />
                                <span className="font-semibold text-blue-700 text-xs ml-0.5">
                                  {ordersCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center text-xs">
                          <FiMail className="text-gray-400 mr-1.5 flex-shrink-0" size={12} />
                          <a 
                            href={`mailto:${customer.email}`}
                            className="text-blue-600 hover:text-blue-800 truncate"
                          >
                            {customer.email}
                          </a>
                        </div>
                        <div className="flex items-center text-xs text-gray-700">
                          <FiPhone className="text-gray-400 mr-1.5 flex-shrink-0" size={12} />
                          <span className="truncate">{customer.phone || "N/A"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Total Spent</p>
                          <p className="font-semibold text-green-700 text-sm">
                            Rs {totalSpent.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Member Since</p>
                          <p className="text-gray-700 text-xs">
                            {formatDate(customer.since)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredCustomers.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col xs:flex-row justify-between items-center p-3 border-t border-gray-200">
            <div className="text-gray-600 text-xs mb-2 xs:mb-0">
              Page {currentPage} of {totalPages} • {filteredCustomers.length} customers
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded border text-sm ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                }`}
              >
                <FiChevronLeft size={14} />
              </button>
              
              <div className="flex items-center gap-0.5">
                {totalPages <= 4 ? (
                  [...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded border text-xs ${
                        currentPage === i + 1
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className={`w-7 h-7 rounded border text-xs ${
                        currentPage === 1
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      }`}
                    >
                      1
                    </button>
                    
                    {currentPage > 3 && (
                      <span className="px-1 text-gray-500">...</span>
                    )}
                    
                    {currentPage > 2 && (
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="w-7 h-7 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-xs"
                      >
                        {currentPage - 1}
                      </button>
                    )}
                    
                    {currentPage > 1 && currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(currentPage)}
                        className="w-7 h-7 rounded border bg-orange-500 border-orange-500 text-white text-xs"
                      >
                        {currentPage}
                      </button>
                    )}
                    
                    {currentPage < totalPages - 1 && (
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="w-7 h-7 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-xs"
                      >
                        {currentPage + 1}
                      </button>
                    )}
                    
                    {currentPage < totalPages - 2 && (
                      <span className="px-1 text-gray-500">...</span>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-7 h-7 rounded border text-xs ${
                        currentPage === totalPages
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded border text-sm ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                }`}
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;