const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

// Bug fix helper: simple email format check
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format before DB query for security
    if (!isValidEmail(email)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwt_secret,
      { expiresIn: config.jwt_expiry }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be user or admin' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
    await user.save();

    res.status(201).json({ message: 'User created successfully', userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'User creation failed', error: error.message });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be user or admin' });
    }

    // Bug fix #7: prevent admin from demoting themselves
    if (userId === req.userId && role === 'user') {
      return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};
