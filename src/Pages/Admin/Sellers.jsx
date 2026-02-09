import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiUser, 
  FiTrash2, 
  FiSearch, 
  FiCalendar, 
  FiEdit, 
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiFilter,
  FiRefreshCw,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical
} from "react-icons/fi";

const SellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    commissionRate: "",
    status: "Active",
    joinedDate: new Date().toISOString().split('T')[0]
  });
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 8; // Reduced for better mobile view

  // Fetch sellers from backend
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/sellers");
      const validSellers = Array.isArray(response.data) ? response.data : [];
      setSellers(validSellers);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError("Failed to load sellers. Please check your connection.");
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success"
      });
    }, 3000);
  };

  // Filter sellers
  const filteredSellers = sellers.filter(seller => {
    if (!seller) return false;
    
    const searchMatch = searchTerm === "" || 
      seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.phone?.includes(searchTerm) ||
      seller.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || 
      seller.status === statusFilter;
    
    const cityMatch = cityFilter === "all" || 
      seller.city === cityFilter;
    
    return searchMatch && statusMatch && cityMatch;
  });

  // Get unique cities for filter
  const uniqueCities = [...new Set(sellers.map(seller => seller.city).filter(Boolean))];

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSellers.length / ITEMS_PER_PAGE));
  const paginatedSellers = filteredSellers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Pakistan",
      commissionRate: "",
      status: "Active",
      joinedDate: new Date().toISOString().split('T')[0]
    });
    setAddModalOpen(true);
  };

  const openEditModal = (seller) => {
    setSelectedSeller(seller);
    setFormData({
      name: seller.name || "",
      email: seller.email || "",
      phone: seller.phone || "",
      address: seller.address || "",
      city: seller.city || "",
      country: seller.country || "Pakistan",
      commissionRate: seller.commissionRate || "",
      status: seller.status || "Active",
      joinedDate: seller.joinedDate || new Date().toISOString().split('T')[0]
    });
    setEditModalOpen(true);
    setMobileMenuOpen(null);
  };

  const openDeleteModal = (seller) => {
    setSelectedSeller(seller);
    setDeleteModalOpen(true);
    setMobileMenuOpen(null);
  };

  const toggleMobileMenu = (sellerId) => {
    setMobileMenuOpen(mobileMenuOpen === sellerId ? null : sellerId);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedSeller(null);
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new seller
  const handleAddSeller = async () => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    if (!formData.email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    if (!formData.phone.trim()) {
      showToast("Phone is required", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/sellers", formData);
      setSellers(prev => [response.data, ...prev]);
      closeModals();
      showToast("Seller added successfully!");
    } catch (err) {
      console.error("Error adding seller:", err);
      showToast(err.response?.data?.message || "Failed to add seller.", "error");
    }
  };

  // Update seller
  const handleUpdateSeller = async () => {
    if (!selectedSeller) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/sellers/${selectedSeller._id}`,
        formData
      );
      setSellers(prev => prev.map(seller => 
        seller._id === selectedSeller._id ? response.data : seller
      ));
      closeModals();
      showToast("Seller updated successfully!");
    } catch (err) {
      console.error("Error updating seller:", err);
      showToast("Failed to update seller.", "error");
    }
  };

  // Delete seller
  const handleDeleteSeller = async () => {
    if (!selectedSeller) return;

    try {
      await axios.delete(`http://localhost:3000/api/sellers/${selectedSeller._id}`);
      setSellers(prev => prev.filter(seller => seller._id !== selectedSeller._id));
      closeModals();
      showToast("Seller deleted successfully!");
    } catch (err) {
      console.error("Error deleting seller:", err);
      showToast("Failed to delete seller.", "error");
    }
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

  // Statistics
  const totalSellers = sellers.length;
  const activeSellers = sellers.filter(seller => seller.status === "Active").length;
  const totalCommission = sellers.reduce((sum, seller) => {
    const commission = parseFloat(seller.commissionRate) || 0;
    return sum + commission;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-5">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 animate-slide-in ${
          toast.type === "success" ? "bg-green-500" : 
          toast.type === "error" ? "bg-red-500" : 
          "bg-blue-500"
        } text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg max-w-full sm:max-w-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              {toast.type === "success" ? (
                <FiCheck className="mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0" />
              ) : toast.type === "error" ? (
                <FiAlertCircle className="mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0" />
              ) : (
                <FiInfo className="mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0" />
              )}
              <span className="font-medium text-sm sm:text-base truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast({ show: false, message: "", type: "success" })}
              className="ml-2 sm:ml-4 hover:opacity-80 flex-shrink-0"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Sellers</h1>
            <p className="text-gray-600 text-sm">Manage sellers and commission details</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={fetchSellers}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm text-sm flex-1 md:flex-none"
            >
              <FiRefreshCw className="text-base" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all text-sm flex-1 md:flex-none"
            >
              <FiPlus className="text-base" />
              <span className="hidden sm:inline">Add Seller</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Sellers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalSellers}</p>
              <p className="text-gray-500 text-xs mt-1">
                {activeSellers} active
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiUser className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Active Sellers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeSellers}</p>
              <p className="text-gray-500 text-xs mt-1">
                {totalSellers > 0 
                  ? `${Math.round((activeSellers / totalSellers) * 100)}% of total`
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
              <p className="text-gray-500 text-xs font-medium">Avg. Commission</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalSellers > 0 
                  ? `${(totalCommission / totalSellers).toFixed(1)}%`
                  : "0%"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Total: {totalCommission.toFixed(1)}%
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
                placeholder="Search sellers..."
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

            {uniqueCities.length > 0 && (
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-sm flex-1"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiX className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Error Loading</h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchSellers}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUser className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Sellers</h3>
            <p className="text-gray-500 text-sm mb-4">Add your first seller</p>
            <button
              onClick={openAddModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Add Seller
            </button>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiSearch className="text-xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Results</h3>
            <p className="text-gray-500 text-sm mb-4">No sellers match search</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCityFilter("all");
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
                        Seller
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedSellers.map(seller => (
                      <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-2">
                              <FiUser className="text-sm text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{seller.name}</p>
                              <p className="text-gray-500 text-xs">ID: {seller._id?.substring(0, 6)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <FiMail className="text-gray-400 mr-1" size={12} />
                              <a 
                                href={`mailto:${seller.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[120px]"
                              >
                                {seller.email}
                              </a>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <FiPhone className="text-gray-400 mr-1" size={12} />
                              <span className="truncate max-w-[100px]">{seller.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <FiMapPin className="text-gray-400 mr-1" size={12} />
                              <span className="text-gray-700 truncate max-w-[80px]">{seller.city || "N/A"}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {seller.country || "Pakistan"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-green-50 to-green-100">
                            <FiDollarSign className="text-green-600 mr-1" size={12} />
                            <span className="font-semibold text-green-700 text-xs">
                              {seller.commissionRate || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            seller.status === "Active" 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {seller.status === "Active" ? (
                              <>
                                <FiCheckCircle className="mr-1" size={12} />
                                Active
                              </>
                            ) : (
                              <>
                                <FiXCircle className="mr-1" size={12} />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-600">
                            {formatDate(seller.joinedDate)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(seller)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit size={14} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(seller)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tablet View */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                {paginatedSellers.map(seller => (
                  <div key={seller._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-2">
                          <FiUser className="text-sm text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{seller.name}</h3>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                            seller.status === "Active" 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {seller.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(seller)}
                          className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                        >
                          <FiEdit size={12} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(seller)}
                          className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <a 
                          href={`mailto:${seller.email}`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium break-all"
                        >
                          {seller.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-gray-700 text-xs font-medium">{seller.phone}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-gray-700 text-xs font-medium">
                          {seller.city || "N/A"}
                        </p>
                      </div>
                      <div className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gradient-to-r from-green-50 to-green-100">
                        <FiDollarSign className="text-green-600 mr-0.5" size={10} />
                        <span className="font-semibold text-green-700 text-xs">
                          {seller.commissionRate || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-100">
                {paginatedSellers.map(seller => (
                  <div key={seller._id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <FiUser className="text-sm text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{seller.name}</h3>
                          <div className="flex items-center mt-0.5">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              seller.status === "Active" 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {seller.status}
                            </span>
                            <div className="ml-1 inline-flex items-center px-1 py-0.5 rounded-full bg-gradient-to-r from-green-50 to-green-100">
                              <FiDollarSign className="text-green-600" size={8} />
                              <span className="font-semibold text-green-700 text-xs ml-0.5">
                                {seller.commissionRate || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleMobileMenu(seller._id)}
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <FiMoreVertical size={16} />
                        </button>
                        
                        {mobileMenuOpen === seller._id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[100px]">
                            <button
                              onClick={() => openEditModal(seller)}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
                            >
                              <FiEdit size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(seller)}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                            >
                              <FiTrash2 size={12} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center text-xs">
                        <FiMail className="text-gray-400 mr-1.5 flex-shrink-0" size={12} />
                        <a 
                          href={`mailto:${seller.email}`}
                          className="text-blue-600 hover:text-blue-800 truncate"
                        >
                          {seller.email}
                        </a>
                      </div>
                      <div className="flex items-center text-xs text-gray-700">
                        <FiPhone className="text-gray-400 mr-1.5 flex-shrink-0" size={12} />
                        <span className="truncate">{seller.phone}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-700">
                        <FiMapPin className="text-gray-400 mr-1.5 flex-shrink-0" size={12} />
                        <span className="truncate">{seller.city || "N/A"}, {seller.country || "Pakistan"}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-1.5">
                      Joined: {formatDate(seller.joinedDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredSellers.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col xs:flex-row justify-between items-center p-3 border-t border-gray-200">
            <div className="text-gray-600 text-xs mb-2 xs:mb-0">
              Page {currentPage} of {totalPages} • {filteredSellers.length} sellers
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

      {/* Add Seller Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Seller</h2>
                <button
                  onClick={closeModals}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="seller@example.com"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      name="commissionRate"
                      value={formData.commissionRate}
                      onChange={handleFormChange}
                      placeholder="15"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Full address"
                    rows="2"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      placeholder="Lahore"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      placeholder="Pakistan"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Joined Date
                  </label>
                  <input
                    type="date"
                    name="joinedDate"
                    value={formData.joinedDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSeller}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm order-1 sm:order-2 mb-2 sm:mb-0"
                >
                  Add Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Seller Modal */}
      {editModalOpen && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Seller</h2>
                <button
                  onClick={closeModals}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      name="commissionRate"
                      value={formData.commissionRate}
                      onChange={handleFormChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    rows="2"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Joined Date
                  </label>
                  <input
                    type="date"
                    name="joinedDate"
                    value={formData.joinedDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSeller}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm order-1 sm:order-2 mb-2 sm:mb-0"
                >
                  Update Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md mx-2 shadow-xl">
            <div className="p-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-2xl text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Seller?</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Delete <span className="font-bold">{selectedSeller.name}</span>?
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSeller}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm order-1 sm:order-2 mb-2 sm:mb-0"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellersPage;