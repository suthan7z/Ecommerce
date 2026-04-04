const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paymentSchemas } = require('../utils/validation');

// Bug fix #3: routes now match the actual PayHere controller functions
// PayHere calls this server-to-server — NO auth middleware
router.post('/notify', paymentController.paymentNotify);

// User routes
router.post('/initiate', authMiddleware, validate(paymentSchemas.initiate), paymentController.initiatePayment);
router.get('/status/:orderId', authMiddleware, paymentController.getPaymentStatus);
router.get('/history', authMiddleware, paymentController.getUserPaymentHistory);

// Admin routes
router.post('/refund', authMiddleware, validate(paymentSchemas.refund), paymentController.refundPayment);
router.get('/history/all', authMiddleware, paymentController.getPaymentHistory);

module.exports = router;
