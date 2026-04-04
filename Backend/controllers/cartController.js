const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch cart', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    // Calculate total
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'Failed to add to cart', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    // Calculate total
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      message: 'Failed to update cart', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Calculate total
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      message: 'Failed to remove from cart', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};
