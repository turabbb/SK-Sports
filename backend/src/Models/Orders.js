const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  orderItems: [
    {
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {  // Add size field for orders with sizes
        type: String,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false,
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentScreenshot: {
    type: String,
    required: false,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  // Add missing tracking fields
  trackingStatus: {
    type: String,
    required: false,
    default: 'Order Received'
  },
  trackingHistory: [{
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }],
  trackingInfo: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', OrderSchema);