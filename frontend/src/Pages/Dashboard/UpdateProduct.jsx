import React, { useState, useEffect } from 'react';
import {
  useFetchAllProductsQuery,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
} from '../../Redux/Features/Products/products';

const UpdateProduct = () => {
  const { data: { products = [] } = {}, isLoading, isError, refetch } = useFetchAllProductsQuery({
    page: 1,
    limit: 1000,
  });

  const [updateProduct] = useUpdateProductsMutation();
  const [deleteProduct] = useDeleteProductsMutation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || '',
        price: selectedProduct.price || '',
        description: selectedProduct.description || '',
        category: selectedProduct.category || '',
        color: selectedProduct.color || '',
        rating: selectedProduct.rating || '',
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
        alert('Failed to update product');
      } else {
        alert('Product updated successfully');
        setSelectedProduct(null);
        setShowEditModal(false);
        refetch();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Something went wrong');
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteProduct({ id: confirmDeleteId });
      if (res.error) {
        alert('Failed to delete product');
      } else {
        alert('Product deleted');
        refetch();
        if (selectedProduct?._id === confirmDeleteId) setSelectedProduct(null);
        setConfirmDeleteId(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading products</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage & Update Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600">Price: Rs. {product.price}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

            <div className="mt-4 flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setSelectedProduct(product);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setConfirmDeleteId(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
            <h3 className="text-2xl font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Rating (max 1 decimal)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  min="0"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
