import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiEye, FiUpload, FiImage } from "react-icons/fi";
import axios from "axios";
import AllProductData from "../../Data/AllProductData";

const MenuItems = () => {
  const [itemsList, setItemsList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mainCategory: "",
    category: "",
    price: "",
    status: "Available",
    img: "",
    description: "",
  });

  /* ================= FETCH + MERGE DATA ================= */
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/products");
        const backendItems = res.data || [];

        // STATIC DATA (AllProductData)
        const staticItems = AllProductData
          .filter(item => item.type === "Item")
          .map(item => ({
            _id: item._id,
            name: item.name,
            mainCategory: Array.isArray(item.mainCategory)
              ? item.mainCategory.join(", ")
              : item.mainCategory,
            category: item.subCategory,
            price: item.price,
            status: item.status === "active" ? "Available" : "Unavailable",
            img: item.img?.[0],
            description: item.description || "No description available",
            isStatic: true,
            uniqueKey: "s-" + item._id
          }));

        // BACKEND DATA
        const dynamicItems = backendItems.map(item => ({
          ...item,
          description: item.description || "No description available",
          isStatic: false,
          uniqueKey: "b-" + item._id
        }));

        const allItems = [...staticItems, ...dynamicItems];
        setItemsList(allItems);
        setFilteredItems(allItems);

      } catch (err) {
        console.log("Fetch error:", err);
        // Fallback to static data only if API fails
        const staticItems = AllProductData
          .filter(item => item.type === "Item")
          .map(item => ({
            _id: item._id,
            name: item.name,
            mainCategory: Array.isArray(item.mainCategory)
              ? item.mainCategory.join(", ")
              : item.mainCategory,
            category: item.subCategory,
            price: item.price,
            status: item.status === "active" ? "Available" : "Unavailable",
            img: item.img?.[0],
            description: item.description || "No description available",
            isStatic: true,
            uniqueKey: "s-" + item._id
          }));
        setItemsList(staticItems);
        setFilteredItems(staticItems);
      }
    };

    fetchMenuItems();
  }, []);

  /* ================= SEARCH AND FILTER ================= */
  useEffect(() => {
    let filtered = itemsList;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mainCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "static") {
        filtered = filtered.filter(item => item.isStatic);
      } else if (categoryFilter === "dynamic") {
        filtered = filtered.filter(item => !item.isStatic);
      } else {
        filtered = filtered.filter(item => 
          item.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsList]);

  /* ================= IMAGE UPLOAD HANDLER ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create FormData
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      // Upload to backend
      const response = await axios.post(
        'http://localhost:3000/api/upload',
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update form data with uploaded image URL
      if (response.data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          img: response.data.imageUrl
        }));
        setPreviewImage(response.data.imageUrl);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ================= IMAGE URL HANDLER ================= */
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      img: url
    }));
    setPreviewImage(url);
  };

  /* ================= PAGINATION ================= */
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= MODAL HANDLERS ================= */
  const openAddModal = () => {
    setFormData({
      name: "",
      mainCategory: "",
      category: "",
      price: "",
      status: "Available",
      img: "",
      description: "",
    });
    setPreviewImage("");
    setModalType("add");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    if (item.isStatic) {
      alert("Static items cannot be edited directly. Please contact administrator.");
      return;
    }
    setSelectedItem(item);
    setFormData({
      name: item.name || "",
      mainCategory: item.mainCategory || "",
      category: item.category || "",
      price: item.price || "",
      status: item.status || "Available",
      img: item.img || "",
      description: item.description || "",
    });
    setPreviewImage(item.img || "");
    setModalType("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    if (item.isStatic) {
      alert("Static items cannot be deleted directly. Please contact administrator.");
      return;
    }
    setModalType("delete");
    setModalOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.name || !formData.mainCategory || !formData.category || !formData.price) {
      alert("Please fill all required fields!");
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      if (modalType === "add") {
        const res = await axios.post(
          "http://localhost:3000/api/products",
          formData
        );

        setItemsList(prev => [
          ...prev,
          {
            ...res.data,
            description: res.data.description || "No description available",
            isStatic: false,
            uniqueKey: "b-" + res.data._id
          }
        ]);
      }

      if (modalType === "edit") {
        const res = await axios.put(
          `http://localhost:3000/api/products/${selectedItem._id}`,
          formData
        );

        setItemsList(prev =>
          prev.map(item =>
            item._id === selectedItem._id
              ? { 
                  ...res.data, 
                  description: res.data.description || "No description available",
                  isStatic: false, 
                  uniqueKey: "b-" + res.data._id 
                }
              : item
          )
        );
      }

      setModalOpen(false);
      setSelectedItem(null);
      setPreviewImage("");

    } catch (err) {
      console.log("Save error:", err);
      alert("Error saving item. Please try again.");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/products/${selectedItem._id}`
      );

      setItemsList(prev =>
        prev.filter(item => item._id !== selectedItem._id)
      );

      setModalOpen(false);
      setSelectedItem(null);

    } catch (err) {
      console.log("Delete error:", err);
      alert("Error deleting item. Please try again.");
    }
  };

  const statusColors = {
    Available: "bg-green-100 text-green-800 border border-green-200",
    Unavailable: "bg-red-100 text-red-800 border border-red-200",
  };

  // Extract unique categories for filter
  const categories = [...new Set(itemsList
    .map(item => item.category)
    .filter(Boolean)
    .filter(cat => cat.toLowerCase() !== 'static' && cat.toLowerCase() !== 'dynamic')
  )];

  // Reset all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Menu Items Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your restaurant menu items</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                     text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all 
                     hover:shadow-lg hover:scale-105"
          >
            <FiPlus className="text-lg" />
            Add New Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-transparent bg-white min-w-[180px]"
              >
                <option value="all">All Items</option>
                <option value="static">Static Items</option>
                <option value="dynamic">Dynamic Items</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {(searchTerm || categoryFilter !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiX /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Items</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{itemsList.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Available</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {itemsList.filter(item => item.status === "Available").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Static Items</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {itemsList.filter(item => item.isStatic).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Dynamic Items</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {itemsList.filter(item => !item.isStatic).length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm uppercase">Item</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm uppercase">Category</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm uppercase">Price</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm uppercase">Status</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm uppercase">Type</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.map(item => (
                <tr key={item.uniqueKey} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {item.img ? (
                        <img 
                          src={item.img} 
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/56x56?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiImage className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-gray-500 text-sm truncate max-w-xs">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-900">{item.category}</p>
                      <p className="text-gray-500 text-sm">{item.mainCategory}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">Rs {parseFloat(item.price).toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      item.isStatic 
                        ? "bg-blue-100 text-blue-800 border border-blue-200" 
                        : "bg-purple-100 text-purple-800 border border-purple-200"
                    }`}>
                      {item.isStatic ? "Static" : "Dynamic"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(item)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        disabled={item.isStatic}
                        className={`p-2 rounded-lg transition-colors ${item.isStatic 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        title={item.isStatic ? "Static items cannot be edited" : "Edit"}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        disabled={item.isStatic}
                        className={`p-2 rounded-lg transition-colors ${item.isStatic 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                        title={item.isStatic ? "Static items cannot be deleted" : "Delete"}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-100">
            {paginatedItems.map(item => (
              <div key={item.uniqueKey} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {item.img ? (
                      <img 
                        src={item.img} 
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiImage className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isStatic 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {item.isStatic ? "Static" : "Dynamic"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-500 text-xs">Price</p>
                    <p className="font-bold text-gray-900">Rs {parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-sm truncate flex-1 mr-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openViewModal(item)}
                      className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      title="View Details"
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      disabled={item.isStatic}
                      className={`p-1.5 rounded-lg ${item.isStatic 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                      title={item.isStatic ? "Static items cannot be edited" : "Edit"}
                    >
                      <FiEdit size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      disabled={item.isStatic}
                      className={`p-1.5 rounded-lg ${item.isStatic 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                      title={item.isStatic ? "Static items cannot be deleted" : "Delete"}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {paginatedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Items Found</h3>
            <p className="text-gray-500 text-sm mb-4">Try changing your search or filter</p>
            <button
              onClick={handleClearFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm mb-3 sm:mb-0">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        currentPage === pageNum
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalType === "add" ? "Add New Item" : "Edit Item"}
                </h3>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setPreviewImage("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Image Upload */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Image
                    </label>
                    
                    {/* Image Preview */}
                    <div className="mb-4">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image";
                            }}
                          />
                          <button
                            onClick={() => {
                              setPreviewImage("");
                              setFormData(prev => ({ ...prev, img: "" }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <FiImage className="mx-auto text-gray-400 text-3xl mb-2" />
                          <p className="text-gray-500 text-sm mb-3">No image selected</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Options */}
                    <div className="space-y-3">
                      {/* Option 1: Upload File */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Image
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                          <label
                            htmlFor="file-upload"
                            className={`flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 
                                     rounded-lg cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                          >
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <FiUpload />
                                <span>Choose File</span>
                              </>
                            )}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Max 5MB, PNG, JPG, JPEG</p>
                        </div>
                      </div>

                      {/* Option 2: Enter URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Or Enter Image URL
                        </label>
                        <input
                          type="text"
                          value={formData.img}
                          onChange={handleImageUrlChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                   focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Item name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.mainCategory}
                          onChange={e => setFormData({ ...formData, mainCategory: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                   focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., Burger, Pizza"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                   focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., Fast Food"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (Rs) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={e => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                   focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={e => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                   focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        >
                          <option value="Available">Available</option>
                          <option value="Unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                                 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Item description..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        setPreviewImage("");
                      }}
                      className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!formData.name || !formData.mainCategory || !formData.category || !formData.price}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed 
                               text-white px-6 py-2 rounded-lg font-medium"
                    >
                      {modalType === "add" ? "Add Item" : "Update Item"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Item Details</h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Image */}
                <div>
                  {selectedItem.img ? (
                    <img
                      src={selectedItem.img}
                      alt={selectedItem.name}
                      className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x256?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiImage className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                      <p className="text-gray-600 mt-1">{selectedItem.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Main Category</p>
                        <p className="font-medium text-gray-900">{selectedItem.mainCategory}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Category</p>
                        <p className="font-medium text-gray-900">{selectedItem.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold text-gray-900 text-xl">Rs {parseFloat(selectedItem.price).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedItem.status]}`}>
                          {selectedItem.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Type</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedItem.isStatic 
                          ? "bg-blue-100 text-blue-800 border border-blue-200" 
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}>
                        {selectedItem.isStatic ? "Static Item" : "Dynamic Item"}
                      </span>
                    </div>

                    {selectedItem.uniqueKey && (
                      <div>
                        <p className="text-gray-500 text-sm">ID</p>
                        <p className="font-mono text-gray-900 text-sm">{selectedItem.uniqueKey}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalOpen && modalType === "delete" && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiTrash2 className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Item</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedItem.name}"</span>? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;