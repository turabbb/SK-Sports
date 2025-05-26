const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateTracking,getOrderByNumber } = require('../Controllers/Orders');

router.post('/placeorder', createOrder);
router.get('/viewOrders', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/tracking', updateTracking);
router.get('/track/:orderNumber', getOrderByNumber); // New route for customer tracking

module.exports = router;