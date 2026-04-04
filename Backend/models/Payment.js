const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'LKR',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'ezcash', 'mcash', 'frimi', 'genie', 'vishwa', 'bank_transfer'],
    default: 'card',
  },
  transactionId: {
    type: String,
    default: null,
  },
  metadata: {
    type: Object,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
