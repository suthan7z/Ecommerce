const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order — uses atomic stock decrement to fix race condition
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock for every item first
    for (const item of cart.items) {
      const product = item.productId;
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product is no longer available` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
        });
      }
    }

    // Bug fix #5: atomic stock decrement — only decrements if stock is still sufficient
    // This prevents race conditions where two orders both pass the check above
    for (const item of cart.items) {
      const result = await Product.findOneAndUpdate(
        { _id: item.productId._id, stock: { $gte: item.quantity } }, // condition: only if stock is still enough
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!result) {
        // Another order grabbed the stock between our check and this update
        // Restore any decrements already done before this failure
        for (const prev of cart.items) {
          if (prev.productId._id.toString() === item.productId._id.toString()) break;
          await Product.findByIdAndUpdate(prev.productId._id, { $inc: { stock: prev.quantity } });
        }
        return res.status(409).json({ message: `"${item.productId.name}" just went out of stock. Please try again.` });
      }
    }

    const order = new Order({
      userId: req.userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalPrice,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      message: 'Failed to create order', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get order details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Failed to update order', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Cancel order — restores stock
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel a shipped or delivered order' });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      message: 'Failed to cancel order', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};
