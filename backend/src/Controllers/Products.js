const Products = require('../Models/Products');
const cloudinary = require('../Config/cloudinary');

const AddProduct = async (req, res) => {
    try {
      const { name, category, description, price, color } = req.body;
  
      let imageUrls = [];
  
      if (req.files && req.files.images) {
        const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
  
        for (let file of files) {
          const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "products",
          });
          imageUrls.push(uploaded.secure_url);
        }
      }
  
      const newProduct = new Products({
        name,
        category,
        description,
        price,
        color,
        image: imageUrls,
      });
  
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
  
    } catch (error) {
      console.error("Error creating a product", error);
      res.status(500).send({ message: "Failure adding a product" });
    }
  };
  

const getProducts = async (req, res) => {
    try {
        const { category, color, price, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (category && category !== "all") {
            filter.category = category;
        }

        if (color && color !== "all") {
            filter.color = color;
        }

        if (price && price !== "all") {
            filter.price = { $lte: price };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalProducts = await Products.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Products.find(filter).skip(skip).limit(parseInt(limit)).populate().sort({ createdAt: -1 });

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
        const updatedProduct = await Products.findByIdAndUpdate(productId, { ...req.body }, { new: true });

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


module.exports = { AddProduct, getProducts, getProductById, updateProduct, deleteProduct, relatedProducts };