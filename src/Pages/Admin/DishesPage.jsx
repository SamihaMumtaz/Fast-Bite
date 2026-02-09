import React, { useEffect, useState, useRef } from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff, FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiImage } from "react-icons/fi";
import axios from "axios";

const DishesPage = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    showInFoodMenu: true,
    img: [],
    type: "Category",
    category: "Food"
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Message state
  const [modalMessage, setModalMessage] = useState({
    show: false,
    text: "",
    type: ""
  });

  const fileInputRef = useRef(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/dishes");
      console.log("📦 Fetched categories:", response.data);
      
      // Sirf Categories filter karo
      const backendCategories = response.data.filter(item => 
        item.type === "Category" || !item.type  // Backward compatibility
      );
      
      setCategories(backendCategories);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      showModalMessage("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  // Show message
  const showModalMessage = (text, type = "error") => {
    setModalMessage({
      show: true,
      text,
      type
    });
    
    setTimeout(() => {
      setModalMessage({
        show: false,
        text: "",
        type: ""
      });
    }, 4000);
  };

  // Modal handlers
  const openAdd = () => { 
    setSelected(null);
    setFormData({ 
      name: "", 
      showInFoodMenu: true, 
      img: [], 
      type: "Category", 
      category: "Food" 
    }); 
    setPreview(""); 
    setModalType("add"); 
    setModalOpen(true);
  };
  
  const openEdit = (cat) => { 
    setSelected(cat); 
    setFormData({ 
      name: cat.name || "",
      showInFoodMenu: cat.showInFoodMenu !== undefined ? cat.showInFoodMenu : true,
      img: cat.img || [],
      type: "Category",
      category: "Food"
    }); 
    setPreview(cat.img?.[0] || ""); 
    setModalType("edit"); 
    setModalOpen(true);
  };
  
  const openDelete = (cat) => { 
    if (!cat?._id) {
      showModalMessage("Invalid category", "error");
      return;
    }
    setSelected(cat); 
    setModalType("delete"); 
    setModalOpen(true);
  };

  // File upload - FIXED VERSION
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      showModalMessage("File must be less than 5MB", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showModalMessage("Only images are allowed", "error");
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    setUploading(true);
    try {
      console.log("📤 Uploading image...");
      const res = await axios.post("http://localhost:3000/api/upload", formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("📥 Upload response:", res.data);
      
      if (res.data && res.data.url) {
        setFormData(prev => ({
          ...prev,
          img: [res.data.url]
        }));
        showModalMessage("Image uploaded successfully!", "success");
      } else {
        throw new Error("No URL in response");
      }
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      showModalMessage(
        err.response?.data?.error || err.response?.data?.message || "Image upload failed", 
        "error"
      );
      URL.revokeObjectURL(objectUrl);
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  // Save - FIXED VERSION
  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      showModalMessage("Category name is required", "error");
      return;
    }

    // Prepare payload - FIX: Check if img is array
    const payload = {
      name: formData.name.trim(),
      showInFoodMenu: formData.showInFoodMenu,
      img: Array.isArray(formData.img) ? formData.img : [formData.img],
      type: "Category",
      category: "Food"
    };

    console.log("📤 Saving payload:", payload);

    try {
      if (modalType === "add") {
        const response = await axios.post("http://localhost:3000/api/dishes", payload);
        console.log("✅ Added:", response.data);
        
        setCategories(prev => [...prev, response.data]);
        showModalMessage("Category added successfully!", "success");
        
        setTimeout(() => {
          setModalOpen(false);
          setSelected(null);
          fetchCategories(); // Refresh list
        }, 1500);
      } else {
        if (!selected?._id) {
          showModalMessage("Category ID missing", "error");
          return;
        }

        const response = await axios.put(
          `http://localhost:3000/api/dishes/${selected._id}`, 
          payload
        );
        console.log("✅ Updated:", response.data);
        
        setCategories(prev => 
          prev.map(cat => cat._id === selected._id ? response.data : cat)
        );
        showModalMessage("Category updated successfully!", "success");
        
        setTimeout(() => {
          setModalOpen(false);
          setSelected(null);
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err);
      showModalMessage(
        err.response?.data?.error || "Something went wrong", 
        "error"
      );
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!selected?._id) {
      showModalMessage("Category ID missing", "error");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/dishes/${selected._id}`);
      
      setCategories(prev => prev.filter(cat => cat._id !== selected._id));
      showModalMessage("Category deleted successfully!", "success");
      
      setTimeout(() => {
        setModalOpen(false);
        setSelected(null);
      }, 1500);

    } catch (err) {
      console.error("❌ Delete error:", err);
      showModalMessage("Failed to delete category", "error");
    }
  };

  const clearPreview = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview("");
    setFormData(prev => ({
      ...prev,
      img: []
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Categories</h1>
          <p className="text-gray-600">Manage your food categories</p>
        </div>
        <button 
          onClick={openAdd} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 mt-4 md:mt-0"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Categories</p>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Visible</p>
          <p className="text-3xl font-bold">
            {categories.filter(c => c.showInFoodMenu).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Hidden</p>
          <p className="text-3xl font-bold">
            {categories.filter(c => !c.showInFoodMenu).length}
          </p>
        </div>
      </div>

      {/* Category Table - FIXED IMAGE ERROR HANDLING */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPlus className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-6">Add your first food category</p>
            <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg">
              Create Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Image</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Visibility</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {cat.img?.[0] && !cat.img[0].includes('via.placeholder.com') ? (
                        <img 
                          src={cat.img[0]} 
                          alt={cat.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiImage className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-sm text-gray-500">
                        ID: {cat._id?.substring(0, 8)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${cat.showInFoodMenu ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className={cat.showInFoodMenu ? 'text-green-700' : 'text-gray-600'}>
                          {cat.showInFoodMenu ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEdit(cat)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => openDelete(cat)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {modalType === "add" ? "Add Category" : 
                   modalType === "edit" ? "Edit Category" : "Delete Category"}
                </h2>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Message */}
            {modalMessage.show && (
              <div className={`mx-6 mt-4 p-3 rounded-lg ${modalMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {modalMessage.type === 'success' ? (
                    <FiCheckCircle className="text-green-500" />
                  ) : (
                    <FiAlertCircle className="text-red-500" />
                  )}
                  <p className={`text-sm ${modalMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {modalMessage.text}
                  </p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalType !== "delete" ? (
                <div className="space-y-5">
                  <div>
                    <label className="block font-medium mb-2">Category Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Appetizers"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">
                      Category Image
                      {uploading && <span className="ml-2 text-sm text-orange-500">(Uploading...)</span>}
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                      {preview ? (
                        <div className="relative inline-block">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-40 h-40 object-cover rounded-lg mx-auto"
                          />
                          <button
                            onClick={clearPreview}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                            disabled={uploading}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiUpload className="text-2xl text-gray-500" />
                          </div>
                          <p className="text-gray-600 mb-2">Upload category image</p>
                          <p className="text-gray-500 text-sm mb-4">PNG, JPG up to 5MB</p>
                          <button
                            onClick={triggerFileInput}
                            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            disabled={uploading}
                          >
                            {uploading ? 'Uploading...' : 'Choose File'}
                          </button>
                        </>
                      )}
                    </div>
                    {formData.img.length > 0 && !preview && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Image ready ({formData.img.length})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Show in Food Menu</p>
                      <p className="text-sm text-gray-500">Visible to customers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.showInFoodMenu}
                        onChange={e => setFormData({...formData, showInFoodMenu: e.target.checked})}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiTrash2 className="text-3xl text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Delete Category?</h3>
                  <p className="text-gray-600 mb-2">
                    Delete <span className="font-bold">{selected?.name}</span>?
                  </p>
                  <p className="text-gray-500 text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  onClick={modalType === "delete" ? handleDelete : handleSave}
                  className={`px-6 py-3 text-white rounded-xl transition-colors disabled:opacity-50 ${
                    modalType === "delete" 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                  disabled={uploading}
                >
                  {uploading ? 'Processing...' : 
                   modalType === "add" ? 'Create Category' : 
                   modalType === "edit" ? 'Save Changes' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishesPage;