const Products = require('../Models/Products');
const cloudinary = require('../Config/cloudinary');
const { getSizesByCategory, isValidSizeForCategory } = require('../Config/sizeConfig');

const AddProduct = async (req, res) => {
  try {
    const { name, category, description, price, color, rating, sizes } = req.body;

    const imageUrls = [];

    if (req.files?.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of imageFiles) {
        const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'products',
        });
        imageUrls.push(uploaded.secure_url);
      }
    }

    // Handle sizes - either from request body or auto-generate based on category
    let productSizes = [];
    
    if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      // Validate provided sizes against category
      const validSizes = sizes.filter(size => isValidSizeForCategory(category, size));
      productSizes = validSizes.length > 0 ? validSizes : getSizesByCategory(category);
    } else {
      // Auto-generate sizes based on category
      productSizes = getSizesByCategory(category);
    }

    const newProduct = new Products({
      name,
      category,
      description,
      price,
      color,
      rating: parseFloat(rating) || 0,
      image: imageUrls,
      sizes: productSizes,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating a product:", error.message);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const getProducts = async (req, res) => {
    try {
        const { 
            category, 
            categories, // NEW: Handle multiple categories
            color, 
            price, 
            minPrice, 
            maxPrice, 
            page = 1, 
            limit = 10 
        } = req.query;

        let filter = {};

        // Category filter - UPDATED to handle both single category and multiple categories
        if (category && category !== "all") {
            filter.category = { $regex: new RegExp(category, 'i') };
        } else if (categories) {
            // Handle multiple categories (comma-separated)
            const categoryArray = categories.split(',').filter(cat => cat.trim() !== '');
            if (categoryArray.length > 0) {
                filter.category = { 
                    $in: categoryArray.map(cat => new RegExp(cat.trim(), 'i'))
                };
            }
        }

        // Color filter
        if (color && color !== "all") {
            filter.color = { $regex: new RegExp(color, 'i') };
        }

        // Price range filter (if both minPrice and maxPrice are provided)
        if (minPrice && maxPrice) {
            filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
        } else if (minPrice) {
            filter.price = { $gte: parseFloat(minPrice) }; // If only minPrice is provided
        } else if (maxPrice) {
            filter.price = { $lte: parseFloat(maxPrice) }; // If only maxPrice is provided
        } else if (price && price !== "all") {
            filter.price = { $lte: parseFloat(price) }; // Single price filter (not a range)
        }

        // Debug logging
        console.log('Filter object:', JSON.stringify(filter, null, 2));

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalProducts = await Products.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Products.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .populate()
            .sort({ createdAt: -1 });

        console.log(`Found ${products.length} products out of ${totalProducts} total`);

        res.status(200).json({ products, totalPages, totalProducts });

    } catch (error) {
        console.error("Error getting the products", error);
        res.status(500).send({ message: "Failure getting the products" });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Products.findById(productId).populate();
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).send({ product });

    } catch (error) {
        console.error("Error getting this product", error);
        res.status(500).send({ message: "Failure getting this product" });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = { ...req.body };

        // If category is being updated, update sizes accordingly
        if (updateData.category) {
            const currentProduct = await Products.findById(productId);
            if (currentProduct && currentProduct.category !== updateData.category) {
                updateData.sizes = getSizesByCategory(updateData.category);
            }
        }

        // If sizes are being manually updated, validate them
        if (updateData.sizes && Array.isArray(updateData.sizes)) {
            const product = await Products.findById(productId);
            const category = updateData.category || product.category;
            updateData.sizes = updateData.sizes.filter(size => 
                isValidSizeForCategory(category, size)
            );
        }

        const updatedProduct = await Products.findByIdAndUpdate(
            productId, 
            updateData, 
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({
            message: "Product updated successfully",
            product: updatedProduct
        })

    } catch (error) {
        console.error("Error updating this product", error);
        res.status(500).send({ message: "Failure updating this product" });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Products.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({
            message: "Product deleted successfully",
            product: deletedProduct
        })

    } catch (error) {
        console.error("Error deleting this product", error);
        res.status(500).send({ message: "Failure deleting this product" });
    }
}

const relatedProducts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "Product ID is required" });
        }

        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const titleRegex = new RegExp(product.name.split(" ").filter(word => word.length > 1).join(" "), "i");

        const relatedProducts = await Products.find({
            _id: { $ne: id },
            $or: [
                { name: { $regex: titleRegex } },
                { category: product.category },
            ]
        })

        res.status(200).send(relatedProducts);

    } catch (error) {
        console.error("Error getting related products", error);
        res.status(500).send({ message: "Failure getting related products" });
    }
}

// New route to get available sizes for a category
const getSizesForCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const sizes = getSizesByCategory(category);
        res.status(200).json({ category, sizes });
    } catch (error) {
        console.error("Error getting sizes for category", error);
        res.status(500).send({ message: "Failure getting sizes for category" });
    }
}

module.exports = { 
    AddProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    relatedProducts,
    getSizesForCategory 
};