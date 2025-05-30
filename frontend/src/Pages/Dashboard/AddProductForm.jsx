import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddProductMutation } from '../../Redux/Features/Products/products';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [rating, setRating] = useState('0');
  const [images, setImages] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleImageDelete = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 5)) {
      setRating(value);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    setColor('');
    setRating('0');
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || images.length === 0) {
      toast.error("Please fill in all required fields and upload at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('color', color);
    formData.append('rating', parseFloat(rating) || 0);
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      console.log('Submitting product with rating:', parseFloat(rating));
      const response = await addProduct(formData).unwrap();
      console.log('API Response:', response);
      
      // Store product data for success modal
      setAddedProduct({
        name,
        category,
        price,
        images: images[0] ? URL.createObjectURL(images[0]) : null
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Success toast
      toast.success("Product added successfully!");
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product.");
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setAddedProduct(null);
  };

  const goToDashboard = () => {
    closeSuccessModal();
    navigate('/dashboard');
  };

  const addAnotherProduct = () => {
    closeSuccessModal();
    // Form is already reset, user can add another product
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSuccessModal}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
                {/* Success Animation */}
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <motion.svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </motion.svg>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  🎉 Product Added!
                </motion.h2>

                {addedProduct && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      {addedProduct.images && (
                        <img
                          src={addedProduct.images}
                          alt={addedProduct.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg text-gray-800">{addedProduct.name}</h3>
                      <p className="text-gray-600">{addedProduct.category}</p>
                      <p className="text-green-600 font-bold text-xl">Rs. {Number(addedProduct.price).toLocaleString()}</p>
                    </div>
                  </motion.div>
                )}

                <motion.p
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Your product has been successfully added to the store!
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={addAnotherProduct}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Another
                  </motion.button>
                  <motion.button
                    onClick={goToDashboard}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Dashboard
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto p-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            ✨ Add New Product
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-blue-500">📦</span>
                  Product Name
                </label>
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                  placeholder="Enter product name..."
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-green-500">🏷️</span>
                  Category
                </label>
                <motion.input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                  placeholder="Enter category..."
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col space-y-3">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-purple-500">📝</span>
                Description
              </label>
              <motion.textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 resize-none"
                rows="4"
                placeholder="Describe your product..."
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-yellow-500">💰</span>
                  Price
                </label>
                <motion.input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                  placeholder="0.00"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-red-500">🎨</span>
                  Color
                </label>
                <motion.input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                  placeholder="Product color..."
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-orange-500">⭐</span>
                  Rating (0-5)
                </label>
                <motion.input
                  type="number"
                  value={rating}
                  onChange={handleRatingChange}
                  className="px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                  min="0"
                  max="5"
                  step="0.1"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col space-y-3">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-indigo-500">📸</span>
                Product Images
              </label>
              <motion.input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="px-4 py-3 border-2 border-dashed rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 cursor-pointer"
                whileHover={{ scale: 1.01 }}
              />
              
              {images.length > 0 && (
                <motion.div
                  className="flex space-x-4 mt-4 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative mb-4 group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Product"
                        className="w-24 h-24 object-cover rounded-xl shadow-lg"
                      />
                      <motion.button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="ri-close-line text-sm"></i>
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center mt-8"
            >
              <motion.button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 min-w-[200px] justify-center"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    Add Product
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AddProductForm;