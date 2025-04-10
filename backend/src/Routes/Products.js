const express = require('express');
const router = express.Router();
const { AddProduct, getProducts, getProductById, updateProduct, deleteProduct, relatedProducts } = require('../Controllers/Products');
const { verifyToken } = require('../middleware/authMiddleware');

router.post("/AddProduct", AddProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/update/:id", verifyToken, updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/related/:id", relatedProducts);

module.exports = router;