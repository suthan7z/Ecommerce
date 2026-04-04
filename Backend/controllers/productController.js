const Product = require('../models/Product');
const User = require('../models/User');

// Get all products — supports search, filter, sort
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort support: price_asc, price_desc, rating, newest
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc')  sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating')     sortOption = { rating: -1 };
    if (sort === 'newest')     sortOption = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch product', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price and category are required' });
    }
    const product = new Product({ name, description, price, category, stock, image });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      message: 'Failed to create product', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      message: 'Failed to update product', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Delete product (admin only) — soft delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      message: 'Failed to delete product', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Add review — now saves userName so UI can display it
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.some(
      r => r.userId.toString() === req.userId
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Fetch user name to save alongside review
    const user = await User.findById(req.userId).select('name');

    product.reviews.push({
      userId: req.userId,
      userName: user?.name || 'Customer',
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Math.round(totalRating / product.reviews.length);

    await product.save();
    res.json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ 
      message: 'Failed to add review', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};
