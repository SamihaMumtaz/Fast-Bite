import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiUpload, FiX, FiSearch } from "react-icons/fi";
import axios from "axios";

const ComboDeals = () => {
    const [comboDeals, setComboDeals] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        items: [""],
        status: "Active",
        image: "",
        isFeatured: false
    });

    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const ITEMS_PER_PAGE = 8;

    // Fetch combo deals from backend
    useEffect(() => {
        fetchComboDeals();
    }, []);

    const fetchComboDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:3000/api/combo-deals");
            setComboDeals(response.data || []);
        } catch (error) {
            console.error("Error fetching combo deals:", error);
            setError("Failed to load combo deals. Please try again.");
            setComboDeals([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter deals based on search
    const filteredDeals = comboDeals.filter(deal =>
        deal.name?.toLowerCase().includes(search.toLowerCase()) ||
        deal.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredDeals.length / ITEMS_PER_PAGE));
    const paginatedDeals = filteredDeals.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Modal handlers
    const openAddModal = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            discountedPrice: "",
            items: [""],
            status: "Active",
            image: "",
            isFeatured: false
        });
        setImagePreview("");
        setImageFile(null);
        setModalType("add");
        setModalOpen(true);
    };

    const openEditModal = (deal) => {
        setSelectedDeal(deal);
        setFormData({
            name: deal.name || "",
            description: deal.description || "",
            price: deal.price || "",
            discountedPrice: deal.discountedPrice || "",
            items: deal.items?.length > 0 ? [...deal.items] : [""],
            status: deal.status || "Active",
            image: deal.image || "",
            isFeatured: deal.isFeatured || false
        });
        setImagePreview(deal.image || "");
        setModalType("edit");
        setModalOpen(true);
    };

    const openDeleteModal = (deal) => {
        setSelectedDeal(deal);
        setModalType("delete");
        setModalOpen(true);
    };

    // Form handlers
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleItemChange = (index, value) => {
        const newItems = [...formData.items];
        newItems[index] = value;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItemField = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, ""] }));
    };

    const removeItemField = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    // Image upload handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImagePreview = () => {
        setImagePreview("");
        setImageFile(null);
        setFormData(prev => ({ ...prev, image: "" }));
    };

    // Calculate discount percentage
    const calculateDiscount = (price, discountedPrice) => {
        if (!price || !discountedPrice) return 0;
        return Math.round(((price - discountedPrice) / price) * 100);
    };

    // Save deal
    const handleSave = async () => {
        // Validate required fields
        if (!formData.name.trim()) {
            alert("Please enter combo deal name");
            return;
        }
        if (!formData.price || !formData.discountedPrice) {
            alert("Please enter both original and discounted price");
            return;
        }
        if (Number(formData.discountedPrice) >= Number(formData.price)) {
            alert("Discounted price must be less than original price");
            return;
        }

        const dealData = new FormData();
        dealData.append("name", formData.name);
        dealData.append("description", formData.description);
        dealData.append("price", formData.price);
        dealData.append("discountedPrice", formData.discountedPrice);
        dealData.append("status", formData.status);
        dealData.append("isFeatured", formData.isFeatured);

        // Add items (filter out empty strings)
        const validItems = formData.items.filter(item => item.trim() !== "");
        validItems.forEach((item, index) => {
            dealData.append(`items[${index}]`, item);
        });

        // Add image if uploaded
        if (imageFile) {
            dealData.append("image", imageFile);
        } else if (formData.image) {
            dealData.append("imageUrl", formData.image);
        }

        try {
            if (modalType === "add") {
                const response = await axios.post("http://localhost:3000/api/combo-deals", dealData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setComboDeals(prev => [...prev, response.data]);
            } else {
                const response = await axios.put(
                    `http://localhost:3000/api/combo-deals/${selectedDeal._id}`,
                    dealData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                setComboDeals(prev =>
                    prev.map(deal => deal._id === selectedDeal._id ? response.data : deal)
                );
            }
            setModalOpen(false);
            fetchComboDeals(); // Refresh data
        } catch (error) {
            console.error("Error saving combo deal:", error);
            alert(error.response?.data?.message || "Error saving combo deal. Please try again.");
        }
    };

    // Delete deal
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/combo-deals/${selectedDeal._id}`);
            setComboDeals(prev => prev.filter(deal => deal._id !== selectedDeal._id));
            setModalOpen(false);
        } catch (error) {
            console.error("Error deleting combo deal:", error);
            alert("Error deleting combo deal. Please try again.");
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Combo Deals</h1>
                    <p className="text-gray-600">Manage your combo deals and special offers</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mt-4 md:mt-0"
                >
                    <FiPlus className="text-lg" />
                    Add Combo Deal
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Deals</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{comboDeals.length}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <FiPlus className="text-2xl text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Deals</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {comboDeals.filter(d => d.status === "Active").length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                            <FiEye className="text-2xl text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Featured</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {comboDeals.filter(d => d.isFeatured).length}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <FiEye className="text-2xl text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg. Discount</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {comboDeals.length > 0
                                    ? Math.round(
                                        comboDeals.reduce((acc, deal) =>
                                            acc + calculateDiscount(deal.price, deal.discountedPrice), 0
                                        ) / comboDeals.length
                                    ) + "%"
                                    : "0%"}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <span className="text-2xl text-purple-600 font-bold">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search combo deals by name or description..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Combo Deals Section */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiX className="text-3xl text-red-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Data</h3>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button
                            onClick={fetchComboDeals}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium"
                        >
                            Retry
                        </button>
                    </div>
                ) : comboDeals.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPlus className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Combo Deals Yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first combo deal</p>
                        <button
                            onClick={openAddModal}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium"
                        >
                            Create Combo Deal
                        </button>
                    </div>
                ) : filteredDeals.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Found</h3>
                        <p className="text-gray-500 mb-6">No combo deals match your search criteria</p>
                        <button
                            onClick={() => setSearch("")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Grid View for larger screens */}
                        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paginatedDeals.map(deal => (
                                <div
                                    key={deal._id}
                                    className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
                                >
                                    <div className="relative">
                                        {deal.image ? (
                                            <img
                                                src={deal.image.startsWith("http") ? deal.image : `http://localhost:3000/uploads/combo-deals/${deal.image}`}
                                                alt={deal.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        {deal.isFeatured && (
                                            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Featured
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {calculateDiscount(deal.price, deal.discountedPrice)}% OFF
                                        </div>
                                        <div className="absolute bottom-3 right-3 flex gap-2">
                                            <button
                                                onClick={() => openEditModal(deal)}
                                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(deal)}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{deal.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${deal.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}>
                                                {deal.status}
                                            </span>
                                        </div>

                                        {deal.description && (
                                            <p className="text-gray-600 mb-4 line-clamp-2">{deal.description}</p>
                                        )}

                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">Includes:</p>
                                            <ul className="space-y-1">
                                                {deal.items?.map((item, index) => (
                                                    <li key={index} className="flex items-center text-gray-700">
                                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                                        <span className="truncate">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    Rs {deal.discountedPrice}
                                                </span>
                                                <span className="text-gray-500 line-through ml-2">
                                                    Rs {deal.price}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Save: Rs {deal.price - deal.discountedPrice}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table View for smaller screens */}
                        <div className="lg:hidden overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Deal</th>
                                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Price</th>
                                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Status</th>
                                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedDeals.map(deal => (
                                        <tr key={deal._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    {deal.image ? (
                                                        <img
                                                            src={deal.image.startsWith("http") ? deal.image : `http://localhost:3000/uploads/combo-deals/${deal.image}`}
                                                            alt={deal.name}
                                                            className="w-12 h-12 rounded-lg object-cover mr-3"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                                                            <span className="text-xs text-gray-400">No Image</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{deal.name}</p>
                                                        {deal.description && (
                                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                                {deal.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">Rs {deal.discountedPrice}</p>
                                                    <p className="text-xs text-gray-500 line-through">Rs {deal.price}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${deal.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {deal.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => openEditModal(deal)}
                                                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                                        title="Edit"
                                                    >
                                                        <FiEdit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(deal)}
                                                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
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
                    </>
                )}

                {/* Pagination */}
                {filteredDeals.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
                        <div className="text-gray-600 text-sm mb-4 sm:mb-0">
                            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredDeals.length)} to{" "}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredDeals.length)} of{" "}
                            {filteredDeals.length} deals
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-lg border text-sm ${currentPage === 1
                                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg border text-sm ${currentPage === i + 1
                                        ? "bg-orange-500 border-orange-500 text-white"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-lg border text-sm ${currentPage === totalPages
                                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {modalType === "add" ? "Add Combo Deal" :
                                        modalType === "edit" ? "Edit Combo Deal" : "Delete Combo Deal"}
                                </h2>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {modalType !== "delete" ? (
                                <div className="space-y-6">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Combo Image
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                                            {imagePreview ? (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-40 h-40 object-cover rounded-lg mx-auto"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={clearImagePreview}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                                                    >
                                                        <FiX className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <FiUpload className="text-3xl text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-600 mb-2">Upload combo image</p>
                                                    <p className="text-gray-500 text-sm mb-4">PNG, JPG up to 5MB</p>
                                                    <label className="cursor-pointer">
                                                        <span className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium inline-block transition-colors">
                                                            Choose File
                                                        </span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Deal Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., Family Feast Combo"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Status
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleFormChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Describe this combo deal..."
                                        />
                                    </div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Original Price (Rs) *
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleFormChange}
                                                min="1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="2999"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Discounted Price (Rs) *
                                            </label>
                                            <input
                                                type="number"
                                                name="discountedPrice"
                                                value={formData.discountedPrice}
                                                onChange={handleFormChange}
                                                min="1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="2499"
                                                required
                                            />
                                            {formData.price && formData.discountedPrice && (
                                                <p className="text-sm mt-2">
                                                    <span className="text-green-600 font-medium">
                                                        Discount: {calculateDiscount(Number(formData.price), Number(formData.discountedPrice))}%
                                                    </span>
                                                    <span className="text-gray-500 ml-2">
                                                        (Save Rs {Number(formData.price) - Number(formData.discountedPrice)})
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Featured Checkbox */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="isFeatured"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleFormChange}
                                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 border-gray-300"
                                        />
                                        <div>
                                            <label htmlFor="isFeatured" className="font-medium text-gray-900 cursor-pointer">
                                                Featured Deal
                                            </label>
                                            <p className="text-sm text-gray-500">Show this deal in featured section</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Delete Confirmation
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FiTrash2 className="text-3xl text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        Delete Combo Deal?
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        Are you sure you want to delete <span className="font-bold">{selectedDeal?.name}</span>?
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        This action cannot be undone. All data related to this combo deal will be permanently removed.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 flex-shrink-0">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={modalType === "delete" ? handleDelete : handleSave}
                                    className={`px-6 py-3 rounded-xl font-medium text-white transition-colors ${modalType === "delete"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                        }`}
                                >
                                    {modalType === "add" ? "Create Deal" :
                                        modalType === "edit" ? "Save Changes" : "Delete Deal"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComboDeals;