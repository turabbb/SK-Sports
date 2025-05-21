const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true },
    }
  ],
  shippingAddress: {
    address: { type: String, required: true }, // street, province, zip
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String },
  paymentScreenshot: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  trackingInfo: {
    status: { type: String, default: 'Pending' },
    updatedAt: Date,
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
