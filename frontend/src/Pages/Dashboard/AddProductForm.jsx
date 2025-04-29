import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddProductMutation } from '../../Redux/Features/Products/products';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [rating, setRating] = useState(0); // New state for rating
  const [images, setImages] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleImageDelete = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
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
    formData.append('rating', rating); // Append the rating
    images.forEach((image) => formData.append('image', image));

    try {
      await addProduct(formData).unwrap();
      toast.success("Product added successfully!");
      navigate('/admin/products');  // Navigate to the admin products page
    } catch (error) {
      toast.error("Failed to add product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-3">
          <label className="text-lg font-semibold text-gray-700">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label className="text-lg font-semibold text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          rows="4"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-gray-700">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-gray-700">Color</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-gray-700">Rating (0-5)</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Math.min(5, Math.max(0, e.target.value)))}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          min="0"
          max="5"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-gray-700">Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex space-x-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(image)} alt="Product" className="w-24 h-24 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => handleImageDelete(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary-dark transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </div>

    </form>
  );
};

export default AddProductForm;
