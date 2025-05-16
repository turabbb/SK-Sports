const Order = require ('../Models/Orders');

const createOrder = async (req, res) => {
  const {
    customerInfo,
    orderItems,
    shippingAddress,
    totalPrice,
  } = req.body;

  // Validate input
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
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


module.exports = {createOrder, getAllOrders};
