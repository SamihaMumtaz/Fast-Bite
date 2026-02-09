import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiMail, 
  FiTrash2, 
  FiSearch, 
  FiCalendar, 
  FiDownload, 
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiFilter,
  FiClock,
  FiUsers
} from "react-icons/fi";
import { saveAs } from 'file-saver';

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 12;

  // Fetch subscribers from backend
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/subscribe");
      // Ensure we have an array and filter out any invalid data
      const validSubscribers = Array.isArray(response.data) 
        ? response.data.filter(sub => sub && sub.email)
        : [];
      setSubscribers(validSubscribers);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to load subscribers. Please check your connection and try again.");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter subscribers based on search and filters
  const filteredSubscribers = subscribers.filter(subscriber => {
    if (!subscriber || !subscriber.email) return false;
    
    // Search filter
    const searchMatch = searchTerm === "" || 
      subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const statusMatch = statusFilter === "all" || 
      (statusFilter === "active" && (!subscriber.status || subscriber.status === "Active")) ||
      (statusFilter === "inactive" && subscriber.status === "Inactive");
    
    // Date filter
    let dateMatch = true;
    if (dateFilter !== "all" && subscriber.createdAt) {
      const subscriberDate = new Date(subscriber.createdAt);
      const today = new Date();
      
      switch(dateFilter) {
        case "today":
          dateMatch = subscriberDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateMatch = subscriberDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateMatch = subscriberDate >= monthAgo;
          break;
        case "year":
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          dateMatch = subscriberDate >= yearAgo;
          break;
        default:
          dateMatch = true;
      }
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  // Sort subscribers by date (newest first)
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedSubscribers.length / ITEMS_PER_PAGE));
  const paginatedSubscribers = sortedSubscribers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modal handlers
  const openDeleteModal = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
    setSelectedSubscriber(null);
  };

  // Delete subscriber
  const handleDelete = async () => {
    if (!selectedSubscriber) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/subscribe/${selectedSubscriber._id}`);
      setSubscribers(prev => prev.filter(sub => sub._id !== selectedSubscriber._id));
      closeModal();
    } catch (err) {
      console.error("Error deleting subscriber:", err);
      alert("Failed to delete subscriber. Please try again.");
    }
  };

  // Export subscribers to CSV
  const exportToCSV = () => {
    if (sortedSubscribers.length === 0) {
      alert("No subscribers to export.");
      return;
    }

    const headers = ["Email", "Name", "Status", "Source", "Subscribed Date"];
    const csvData = [
      headers.join(","),
      ...sortedSubscribers.map(sub => [
        `"${sub.email || ''}"`,
        `"${sub.name || 'N/A'}"`,
        `"${sub.status || 'Active'}"`,
        `"${sub.source || 'Website'}"`,
        `"${formatDate(sub.createdAt)}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
  };

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

  // Get time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffDays < 30) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      } else {
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
      }
    } catch (error) {
      return "Unknown";
    }
  };

  // Statistics
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(sub => !sub.status || sub.status === "Active").length;
  const thisMonthSubscribers = subscribers.filter(sub => {
    if (!sub.createdAt) return false;
    try {
      const subDate = new Date(sub.createdAt);
      const today = new Date();
      return subDate.getMonth() === today.getMonth() && 
             subDate.getFullYear() === today.getFullYear();
    } catch (error) {
      return false;
    }
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Subscribers</h1>
            <p className="text-gray-600">Manage your newsletter subscribers and email list</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              disabled={sortedSubscribers.length === 0}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                sortedSubscribers.length === 0
                  ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiDownload className="text-lg" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Subscribers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalSubscribers}</p>
              <p className="text-gray-500 text-xs mt-2">
                +{thisMonthSubscribers} this month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FiUsers className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Subscribers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeSubscribers}</p>
              <p className="text-gray-500 text-xs mt-2">
                {totalSubscribers > 0 
                  ? `${Math.round((activeSubscribers / totalSubscribers) * 100)}% of total`
                  : "0% of total"}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FiCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Inactive Subscribers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalSubscribers - activeSubscribers}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {totalSubscribers > 0 
                  ? `${Math.round(((totalSubscribers - activeSubscribers) / totalSubscribers) * 100)}% of total`
                  : "0% of total"}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <FiAlertCircle className="text-2xl text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subscribers by email or name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {error ? (
          <div className="text-center py-16">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="text-3xl text-red-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Subscribers</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchSubscribers}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : sortedSubscribers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {subscribers.length === 0 ? "No Subscribers Yet" : "No Subscribers Found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {subscribers.length === 0 
                ? "Subscribers will appear here when they sign up through your website." 
                : "No subscribers match your search criteria."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {paginatedSubscribers.map(subscriber => (
                <div
                  key={subscriber._id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-4">
                        <FiMail className="text-xl text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {subscriber.name || "Anonymous"}
                        </h3>
                        <a 
                          href={`mailto:${subscriber.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all"
                        >
                          {subscriber.email}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => openDeleteModal(subscriber)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        (!subscriber.status || subscriber.status === "Active") 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(!subscriber.status || subscriber.status === "Active") ? (
                          <>
                            <FiCheckCircle className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {subscriber.source || "Website"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 flex-shrink-0" />
                      <div>
                        <p>{formatDate(subscriber.createdAt)}</p>
                        <p className="text-xs">{getTimeAgo(subscriber.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile List View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {paginatedSubscribers.map(subscriber => (
                <div 
                  key={subscriber._id} 
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {subscriber.name || "Anonymous"}
                      </h3>
                      <a 
                        href={`mailto:${subscriber.email}`}
                        className="text-blue-600 hover:text-blue-800 text-sm break-all"
                      >
                        {subscriber.email}
                      </a>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      (!subscriber.status || subscriber.status === "Active") 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {(!subscriber.status || subscriber.status === "Active") ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      <span>{getTimeAgo(subscriber.createdAt)}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {subscriber.source || "Website"}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => openDeleteModal(subscriber)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {sortedSubscribers.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 border-t border-gray-200">
            <div className="text-gray-600 text-sm mb-4 sm:mb-0">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, sortedSubscribers.length)} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedSubscribers.length)} of{" "}
              {sortedSubscribers.length} subscribers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg border text-sm ${
                    currentPage === i + 1
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-xl">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiTrash2 className="text-3xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Remove Subscriber?</h3>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to remove{" "}
                  <span className="font-bold">{selectedSubscriber.email}</span> from your subscribers list?
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  This action cannot be undone. The subscriber will be permanently removed and will no longer receive emails.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors order-1 sm:order-2 mb-3 sm:mb-0"
                >
                  Remove Subscriber
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribersPage;