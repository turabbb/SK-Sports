const express = require('express');
const router = express.Router();

router.post('/AddProduct', AddProducts);

module.exports = router;