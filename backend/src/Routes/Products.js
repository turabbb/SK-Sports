const express = require('express');
const router = express.Router();
const { 
    AddProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    relatedProducts,
    getSizesForCategory 
} = require('../Controllers/Products');
const { verifyToken } = require('../middleware/authMiddleware');

router.post("/addProduct", AddProduct);
router.get("/", getProducts);
router.get("/sizes/:category", getSizesForCategory); // New route for getting sizes by category
router.get("/:id", getProductById);
router.patch("/update/:id", verifyToken, updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/related/:id", relatedProducts);

module.exports = router;