const Order = require('../Models/Orders');
const cloudinary = require('../Config/cloudinary');

// Create Order
const createOrder = async (req, res) => {
  console.log("Received order creation request");
  try {
    // Log the body to diagnose problems
    console.log("Request body type:", typeof req.body);
    console.log("Request body keys:", Object.keys(req.body));

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

    // Convert totalPrice to number if it's a string
    const parsedTotalPrice = typeof totalPrice === 'string' ? parseFloat(totalPrice) : totalPrice;

    // Debug the parsed data
    console.log("Parsed customer info:", parsedCustomerInfo);
    console.log("Parsed shipping address:", parsedShippingAddress);
    console.log("Parsed order items (sample):", parsedOrderItems.length > 0 ? parsedOrderItems[0] : 'No items');
    console.log("Parsed total price:", parsedTotalPrice);

    // Validate required fields
    if (!parsedOrderItems || parsedOrderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!parsedCustomerInfo?.name || !parsedCustomerInfo?.email) {
      return res.status(400).json({ message: 'Customer name and email are required' });
    }

    let paymentScreenshotUrl = null;

    // Handle payment screenshot upload only if payment method is "Pay Now"
    if (paymentMethod === "Pay Now" && req.files && req.files.paymentScreenshot) {
      try {
        console.log("Processing payment screenshot upload...");
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          req.files.paymentScreenshot.tempFilePath,
          { folder: 'paymentScreenshots' }
        );
        paymentScreenshotUrl = result.secure_url;
        console.log("Payment screenshot uploaded:", paymentScreenshotUrl);
      } catch (uploadError) {
        console.error("Error uploading payment screenshot:", uploadError);
        // Continue without failing the entire order process
      }
    }

    // Transform cart items to match the Order schema's expected format
    const transformedItems = parsedOrderItems.map(item => ({
      title: item.name || item.title || "Untitled Product",
      price: item.price,
      quantity: item.quantity ?? item.qty ?? 1,  // use quantity, fallback to qty, fallback to 1
      image: Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : (typeof item.image === 'string' ? item.image : ""),
      product: item.product || item._id || null,
    }));

    console.log("Transformed order items:", transformedItems);

    // Create order with or without screenshot URL
    const order = new Order({
      customerInfo: parsedCustomerInfo,
      orderItems: transformedItems,
      shippingAddress: parsedShippingAddress,
      totalPrice: parsedTotalPrice,
      paymentMethod,
      paymentScreenshot: paymentScreenshotUrl, // null if not uploaded
      isPaid: paymentMethod === "Pay Now",
      paidAt: paymentMethod === "Pay Now" ? new Date() : null
    });

    const createdOrder = await order.save();
    console.log("Order created successfully:", createdOrder._id);

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Failed to create order',
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });  // Most recent orders first
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get Single Order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
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
  const { trackingInfo } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.trackingInfo = trackingInfo;
    await order.save();

    res.status(200).json({ message: 'Tracking info updated successfully', order });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ message: 'Failed to update tracking' });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateTracking };