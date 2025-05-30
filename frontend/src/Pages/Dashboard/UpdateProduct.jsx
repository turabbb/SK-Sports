import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useFetchAllProductsQuery,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
} from '../../Redux/Features/Products/products';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
  const { data: { products = [] } = {}, isLoading, isError, refetch } = useFetchAllProductsQuery({
    page: 1,
    limit: 1000,
  });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductsMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductsMutation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    color: '',
    rating: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAction, setSuccessAction] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || '',
        price: selectedProduct.price || '',
        description: selectedProduct.description || '',
        category: selectedProduct.category || '',
        color: selectedProduct.color || '',
        rating: selectedProduct.rating?.toString() || '',
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'rating') {
      const isValid = /^(\d+(\.\d{0,1})?)?$/.test(value);
      if (!isValid) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { name, price, description, category, color, rating } = formData;

      const response = await updateProduct({
        id: selectedProduct._id,
        name,
        price,
        description,
        category,
        color,
        rating,
      });

      if (response.error) {
        toast.error('Failed to update product');
      } else {
        toast.success('Product updated successfully!');
        setSuccessAction('updated');
        setShowSuccessModal(true);
        setSelectedProduct(null);
        setShowEditModal(false);
        refetch();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Something went wrong');
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteProduct({ id: confirmDeleteId });
      if (res.error) {
        toast.error('Failed to delete product');
      } else {
        toast.success('Product deleted successfully!');
        setSuccessAction('deleted');
        setShowSuccessModal(true);
        refetch();
        if (selectedProduct?._id === confirmDeleteId) setSelectedProduct(null);
        setConfirmDeleteId(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-gray-600">Loading products...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-red-500 text-xl">⚠️ Error loading products</div>
        <motion.button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className={`mx-auto w-20 h-20 ${successAction === 'deleted' ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'} rounded-full flex items-center justify-center`}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white text-3xl"
                    >
                      {successAction === 'deleted' ? '🗑️' : '✅'}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  className={`text-3xl font-bold mb-4 ${successAction === 'deleted' ? 'text-red-600' : 'text-green-600'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {successAction === 'deleted' ? '🗑️ Product Deleted!' : '✨ Product Updated!'}
                </motion.h2>

                <motion.p
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {successAction === 'deleted' 
                    ? 'The product has been successfully removed from your store.'
                    : 'Your product information has been successfully updated!'
                  }
                </motion.p>

                <motion.button
                  onClick={() => setShowSuccessModal(false)}
                  className={`px-8 py-3 ${successAction === 'deleted' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-xl font-semibold shadow-lg transition-colors`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🛠️ Manage Products
          </h2>
          <p className="text-gray-600 text-lg">Update, edit, or remove products from your store</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Product Image */}
              {product.image && product.image.length > 0 && (
                <motion.img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-green-600">Rs. {Number(product.price).toLocaleString()}</p>
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                  {product.category}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-6 flex gap-2">
                <motion.button
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-md"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowEditModal(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✏️ Edit
                </motion.button>
                <motion.button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors shadow-md"
                  onClick={() => setConfirmDeleteId(product._id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🗑️ Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditModal && selectedProduct && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ✏️ Edit Product
                  </h3>
                  <motion.button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-blue-500">📦</span>
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-green-500">💰</span>
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-purple-500">🏷️</span>
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-red-500">🎨</span>
                        Color
                      </label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-yellow-500">⭐</span>
                        Rating (0-5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        min="0"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-indigo-500">📝</span>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </motion.div>

                  <motion.div
                    className="flex justify-end gap-4 pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                      }}
                      className="px-6 py-3 bg-gray-400 text-white rounded-xl font-semibold hover:bg-gray-500 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isUpdating}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isUpdating ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-3xl">⚠️</span>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold mb-4 text-red-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Confirm Deletion
                </motion.h2>

                <motion.p
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Are you sure you want to delete this product? This action cannot be undone.
                </motion.p>

                <motion.div
                  className="flex justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isDeleting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        Delete
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateProduct;