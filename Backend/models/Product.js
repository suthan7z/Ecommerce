const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
