import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiEye, FiX, FiMail, FiUser, FiCalendar, FiMessageSquare, FiSearch, FiFilter, FiClock } from "react-icons/fi";

const ContactPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  // Fetch messages from backend
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/contact");
      setMessages(response.data || []);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      setError("Failed to load contact messages. Please try again.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter messages based on search and filters
  const filteredMessages = messages.filter(message => {
    // Search filter
    const searchMatch = searchTerm === "" || 
      message.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === "all" || 
      (statusFilter === "read" && message.read) ||
      (statusFilter === "unread" && !message.read);
    
    // Date filter
    let dateMatch = true;
    if (dateFilter !== "all" && message.createdAt) {
      const messageDate = new Date(message.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      switch(dateFilter) {
        case "today":
          dateMatch = messageDate.toDateString() === today.toDateString();
          break;
        case "yesterday":
          dateMatch = messageDate.toDateString() === yesterday.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateMatch = messageDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateMatch = messageDate >= monthAgo;
          break;
        default:
          dateMatch = true;
      }
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / ITEMS_PER_PAGE));
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modal handlers
  const openViewModal = (message) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    
    // Mark as read if not already
    if (!message.read) {
      markAsRead(message._id);
    }
  };

  const openDeleteModal = (message) => {
    setSelectedMessage(message);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedMessage(null);
  };

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      await axios.patch(`http://localhost:3000/api/contact/${messageId}/read`, { read: true });
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  // Delete message
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/contact/${selectedMessage._id}`);
      setMessages(prev => prev.filter(msg => msg._id !== selectedMessage._id));
      closeModals();
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get time ago
  const getTimeAgo = (dateString) => {
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
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Statistics
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(msg => !msg.read).length;
  const todayMessages = messages.filter(msg => {
    const msgDate = new Date(msg.createdAt);
    const today = new Date();
    return msgDate.toDateString() === today.toDateString();
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalMessages}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FiMail className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{unreadMessages}</p>
            </div>
            <div className={`p-3 rounded-xl ${unreadMessages > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <FiMail className={`text-2xl ${unreadMessages > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{todayMessages}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <FiClock className="text-2xl text-orange-600" />
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
                placeholder="Search messages by name, email, or content..."
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
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
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
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {error ? (
          <div className="text-center py-16">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="text-3xl text-red-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Messages</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchMessages}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {messages.length === 0 ? "No Messages Yet" : "No Messages Found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {messages.length === 0 
                ? "Contact messages will appear here when customers reach out." 
                : "No messages match your search criteria."}
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
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        Sender
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiMail className="mr-2" />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiMessageSquare className="mr-2" />
                        Message
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedMessages.map(message => (
                    <tr 
                      key={message._id} 
                      className={`hover:bg-gray-50 transition-colors ${!message.read ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {message.firstName} {message.lastName}
                          </p>
                          {message.phone && (
                            <p className="text-sm text-gray-500">{message.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`mailto:${message.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {message.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-gray-700 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-gray-900 text-sm">
                            {formatDate(message.createdAt)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {getTimeAgo(message.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          message.read 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {message.read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openViewModal(message)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => openDeleteModal(message)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-100">
                {paginatedMessages.map(message => (
                  <div 
                    key={message._id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!message.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {message.firstName} {message.lastName}
                        </h3>
                        <a 
                          href={`mailto:${message.email}`}
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {message.email}
                        </a>
                        {message.phone && (
                          <p className="text-gray-500 text-sm">{message.phone}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        message.read 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {message.read ? 'Read' : 'Unread'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700 line-clamp-3">
                        {message.message}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p>{getTimeAgo(message.createdAt)}</p>
                        <p className="text-xs">{formatDate(message.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(message)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(message)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredMessages.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 border-t border-gray-200">
            <div className="text-gray-600 text-sm mb-4 sm:mb-0">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredMessages.length)} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredMessages.length)} of{" "}
              {filteredMessages.length} messages
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

      {/* View Message Modal */}
      {viewModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
                  <p className="text-gray-500 text-sm">
                    Received {getTimeAgo(selectedMessage.createdAt)}
                  </p>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Sender Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiUser className="mr-2" />
                      Sender Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {selectedMessage.firstName} {selectedMessage.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <a 
                            href={`tel:${selectedMessage.phone}`}
                            className="text-gray-900 hover:text-blue-600 font-medium"
                          >
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiCalendar className="mr-2" />
                      Message Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedMessage.read 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {selectedMessage.read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <FiMessageSquare className="mr-2" />
                    Message Content
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-3">Reply to Message</h3>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Type your response here..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          alert("Reply feature would be implemented here");
                        }}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => openDeleteModal(selectedMessage)}
                  className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors border border-red-200"
                >
                  Delete Message
                </button>
                <button
                  onClick={closeModals}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-xl">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiTrash2 className="text-3xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Message?</h3>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete the message from{" "}
                  <span className="font-bold">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </span>?
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  This action cannot be undone. The message will be permanently removed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors order-1 sm:order-2 mb-3 sm:mb-0"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;