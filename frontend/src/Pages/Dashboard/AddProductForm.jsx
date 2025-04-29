import { useState } from "react";
import { useAddProductMutation } from "../../Redux/Features/Products/products";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"; // If you want to show toast notifications

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [images, setImages] = useState([]); // Changed to accept multiple images
  const [isLoading, setIsLoading] = useState(false);

  const [addProduct] = useAddProductMutation(); // Redux Toolkit Mutation

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || images.length === 0) {
      toast.error("Please fill in all required fields and upload at least one image!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("color", color);
    
    // Loop through all the images and append them to the formData
    images.forEach(image => {
      formData.append("image", image); // Each image is appended as "image" field
    });

    try {
      // Call the mutation to add the product
      const result = await addProduct(formData).unwrap();
      toast.success("Product added successfully!");
      console.log(result);
    } catch (error) {
      toast.error("Failed to add product.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles); // Update the images state with the selected files
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Category</label>
          <input
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Description</label>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Color */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Color</label>
          <input
            type="text"
            placeholder="Enter color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Upload Images</label>
          <input
            type="file"
            multiple // Allows multiple file selection
            onChange={handleImageChange}
            className="px-4 py-2 border rounded-md"
          />
          {images.length > 0 && (
            <div className="mt-2 text-sm">
              <p><strong>Selected images:</strong></p>
              <ul>
                {images.map((img, index) => (
                  <li key={index}>{img.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${isLoading ? "opacity-50" : ""}`}
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
