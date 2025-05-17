const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateTracking } = require('../Controllers/Orders');

router.post('/placeorder', createOrder);
router.get('/viewOrders', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/tracking', updateTracking);

module.exports = router;
