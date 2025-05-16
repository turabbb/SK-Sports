const express = require('express');
const router = express.Router();
const {createOrder, getAllOrders} = require('../Controllers/Orders');


router.post('/placeorder', createOrder);
router.get('/viewOrders', getAllOrders);


module.exports = router;