const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        productName: String,
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      default: 'card'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
