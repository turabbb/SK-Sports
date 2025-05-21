const Order = require('../Models/Orders');
const cloudinary = require('../Config/cloudinary');

// Create Order
const createOrder = async (req, res) => {
  console.log("Received order creation request:", req.body);
  try {
    // Parse fields from req.body
    const {
      customerInfo,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    } = req.body;

    // Parse JSON strings if needed (because FormData sends strings)
    const parsedCustomerInfo = typeof customerInfo === 'string' ? JSON.parse(customerInfo) : customerInfo;
    const parsedOrderItems = typeof orderItems === 'string' ? JSON.parse(orderItems) : orderItems;
    const parsedShippingAddress = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress;

    if (!parsedOrderItems || parsedOrderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!parsedCustomerInfo?.name || !parsedCustomerInfo?.email) {
      return res.status(400).json({ message: 'Customer name and email are required' });
    }

    let paymentScreenshotUrl = null;

    // Handle payment screenshot upload only if payment method is "Pay Now"
    if (paymentMethod === "Pay Now" && req.files?.paymentScreenshot) {
      // Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(req.files.paymentScreenshot.tempFilePath, {
        folder: 'paymentScreenshots',
      });
      paymentScreenshotUrl = uploaded.secure_url;
    }

    // Create order with or without screenshot URL
    const order = new Order({
      customerInfo: parsedCustomerInfo,
      orderItems: parsedOrderItems,
      shippingAddress: parsedShippingAddress,
      totalPrice,
      paymentMethod,
      paymentScreenshot: paymentScreenshotUrl, // null if not uploaded
      isPaid: paymentMethod === "Pay Now",
      paidAt: paymentMethod === "Pay Now" ? new Date() : null
    });

    const createdOrder = await order.save();
    // TODO: Send Email Here if needed

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
