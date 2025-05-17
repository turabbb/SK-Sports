const Order = require('../Models/Orders');

// Create Order
const createOrder = async (req, res) => {
  const {
    customerInfo,
    orderItems,
    shippingAddress,
    totalPrice,
    paymentMethod,
    paymentScreenshot
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  if (!customerInfo?.name || !customerInfo?.email) {
    return res.status(400).json({ message: 'Customer name and email are required' });
  }

  try {
    const order = new Order({
      customerInfo,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
      paymentScreenshot,
      isPaid: paymentMethod === "Pay Now",
      paidAt: paymentMethod === "Pay Now" ? new Date() : null
    });

    const createdOrder = await order.save();
    // TODO: Send Email Here
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get Single Order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Update Order Tracking
const updateTracking = async (req, res) => {
  const { id } = req.params;
  const { trackingInfo } = req.body;  // expecting something like { status: "...", updatedAt: "...", etc. }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.trackingInfo = trackingInfo;  // You might want to extend the Order schema to include trackingInfo field
    await order.save();

    res.status(200).json({ message: 'Tracking info updated successfully', order });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ message: 'Failed to update tracking' });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateTracking };
