import React, { useEffect, useState } from "react";
import { 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign, 
  FiPackage,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiMessageSquare,
  FiTruck
} from "react-icons/fi";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}`, { status: "Completed" });
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: "Completed" } : order
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedOrder) return;
      await axios.delete(`http://localhost:3000/api/orders/${selectedOrder._id}`);
      setOrders(prev => prev.filter(o => o._id !== selectedOrder._id));
      setDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const searchMatch = search === "" || 
      order.item?.toLowerCase().includes(search.toLowerCase()) ||
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      order.billing?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      order.billing?.lastName?.toLowerCase().includes(search.toLowerCase());
    
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Sort by latest
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const completedOrders = orders.filter(o => o.status === "Completed" || o.status === "Paid").length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed":
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Orders Dashboard</h1>
            <p className="text-gray-600 text-sm">Manage and track customer orders</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={fetchOrders}
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
              <p className="text-gray-500 text-xs font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
              <p className="text-gray-500 text-xs mt-1">
                {pendingOrders} pending
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiPackage className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingOrders}</p>
              <p className="text-gray-500 text-xs mt-1">
                {totalOrders > 0 
                  ? `${Math.round((pendingOrders / totalOrders) * 100)}% of total`
                  : "0%"}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <FiClock className="text-lg text-yellow-600" />
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
                {totalOrders > 0 
                  ? `Avg: Rs ${(totalRevenue / totalOrders).toFixed(0)}`
                  : "No orders"}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiDollarSign className="text-lg text-green-600" />
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
                placeholder="Search orders by item, ID, or customer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
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
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiX className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Error Loading</h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiPackage className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders</h3>
            <p className="text-gray-500 text-sm mb-4">Orders will appear here when customers place orders</p>
            <button
              onClick={fetchOrders}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiSearch className="text-xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Results</h3>
            <p className="text-gray-500 text-sm mb-4">No orders match your search</p>
            <button
              onClick={() => {
                setSearch("");
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedOrders.map((order) => (
                      <React.Fragment key={order._id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">#{order._id?.substring(0, 8).toUpperCase()}</p>
                              <p className="text-gray-700 text-sm mt-1">{order.item}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-gray-900 text-sm">
                                {order.billing?.firstName} {order.billing?.lastName}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {order.billing?.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900">
                              Rs {order.price?.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status === "Pending" && <FiClock className="mr-1" size={10} />}
                              {order.status === "Completed" && <FiCheckCircle className="mr-1" size={10} />}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                className={`p-1.5 rounded-lg transition-colors text-sm ${
                                  expandedOrder === order._id 
                                    ? "bg-orange-100 text-orange-600" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                title={expandedOrder === order._id ? "Hide Details" : "View Details"}
                              >
                                {expandedOrder === order._id ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                              </button>
                              
                              {order.status === "Pending" && (
                                <button
                                  onClick={() => handleCompleteOrder(order._id)}
                                  className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                  title="Mark as Completed"
                                >
                                  <FiCheckCircle size={14} />
                                </button>
                              )}

                              <button
                                onClick={() => openDeleteModal(order)}
                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Delete Order"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedOrder === order._id && (
                          <tr className="bg-gray-50">
                            <td colSpan={5} className="p-4">
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {/* Billing Info */}
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800 text-sm flex items-center">
                                      <FiUser className="mr-2" size={14} />
                                      Billing Information
                                    </h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p><span className="font-medium">Name:</span> {order.billing?.firstName} {order.billing?.lastName}</p>
                                      <p><span className="font-medium">Email:</span> {order.billing?.email}</p>
                                      <p><span className="font-medium">Phone:</span> {order.billing?.phone}</p>
                                      <p><span className="font-medium">Address:</span> {order.billing?.address}</p>
                                      <p>{order.billing?.city}, {order.billing?.state}, {order.billing?.country}</p>
                                      <p><span className="font-medium">ZIP:</span> {order.billing?.zip}</p>
                                    </div>
                                  </div>

                                  {/* Shipping Info */}
                                  {order.shipDifferent && (
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-gray-800 text-sm flex items-center">
                                        <FiTruck className="mr-2" size={14} />
                                        Shipping Information
                                      </h4>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Name:</span> {order.shipAddress?.firstName} {order.shipAddress?.lastName}</p>
                                        <p><span className="font-medium">Address:</span> {order.shipAddress?.address}</p>
                                        <p>{order.shipAddress?.city}, {order.shipAddress?.state}, {order.shipAddress?.country}</p>
                                        <p><span className="font-medium">ZIP:</span> {order.shipAddress?.zip}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Payment Info */}
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800 text-sm flex items-center">
                                      <FiCreditCard className="mr-2" size={14} />
                                      Payment Details
                                    </h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p><span className="font-medium">Method:</span> {order.paymentMethod === "card" ? "Credit Card" : order.paymentMethod}</p>
                                      {order.paymentMethod === "card" && order.cardDetails && (
                                        <>
                                          <p><span className="font-medium">Card Name:</span> {order.cardDetails?.cardName}</p>
                                          <p><span className="font-medium">Card Number:</span> **** **** **** {order.cardDetails?.cardNumber?.slice(-4)}</p>
                                          <p><span className="font-medium">Expiry:</span> {order.cardDetails?.expiry}</p>
                                        </>
                                      )}
                                      {order.message && (
                                        <div className="mt-2">
                                          <h5 className="font-medium text-gray-800 flex items-center">
                                            <FiMessageSquare className="mr-1" size={12} />
                                            Customer Notes
                                          </h5>
                                          <p className="text-gray-600 italic">{order.message}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-100">
                {paginatedOrders.map((order) => (
                  <div key={order._id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 text-sm truncate">
                            #{order._id?.substring(0, 6).toUpperCase()}
                          </h3>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm truncate">{order.item}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="text-gray-700 text-sm font-medium truncate">
                          {order.billing?.firstName} {order.billing?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          Rs {order.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className={`p-1.5 rounded-lg transition-colors text-sm ${
                            expandedOrder === order._id 
                              ? "bg-orange-100 text-orange-600" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={expandedOrder === order._id ? "Hide Details" : "View Details"}
                        >
                          {expandedOrder === order._id ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        </button>
                        
                        {order.status === "Pending" && (
                          <button
                            onClick={() => handleCompleteOrder(order._id)}
                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            title="Mark as Completed"
                          >
                            <FiCheckCircle size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => openDeleteModal(order)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Delete Order"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details for Mobile */}
                    {expandedOrder === order._id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="space-y-3">
                          {/* Billing Info */}
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Billing Info</h4>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <p><span className="font-medium">Name:</span> {order.billing?.firstName} {order.billing?.lastName}</p>
                              <p><span className="font-medium">Email:</span> {order.billing?.email}</p>
                              <p><span className="font-medium">Phone:</span> {order.billing?.phone}</p>
                              <p><span className="font-medium">Address:</span> {order.billing?.address}</p>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Payment</h4>
                            <div className="text-xs text-gray-600">
                              <p><span className="font-medium">Method:</span> {order.paymentMethod === "card" ? "Credit Card" : order.paymentMethod}</p>
                              {order.paymentMethod === "card" && order.cardDetails && (
                                <p><span className="font-medium">Card:</span> ****{order.cardDetails?.cardNumber?.slice(-4)}</p>
                              )}
                            </div>
                          </div>

                          {/* Customer Notes */}
                          {order.message && (
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-1">Notes</h4>
                              <p className="text-xs text-gray-600 italic">{order.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredOrders.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col xs:flex-row justify-between items-center p-3 border-t border-gray-200">
            <div className="text-gray-600 text-xs mb-2 xs:mb-0">
              Page {currentPage} of {totalPages} • {filteredOrders.length} orders
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md mx-2 shadow-xl">
            <div className="p-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-2xl text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Order?</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Delete order <span className="font-bold">#{selectedOrder._id?.substring(0, 6).toUpperCase()}</span>?
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm order-1 sm:order-2 mb-2 sm:mb-0"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;