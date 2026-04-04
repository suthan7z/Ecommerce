const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { orderSchemas } = require('../utils/validation');

// Protected routes (user)
router.post('/', authMiddleware, validate(orderSchemas.create), orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, validate(orderSchemas.updateStatus), orderController.updateOrderStatus);

module.exports = router;
