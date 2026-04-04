const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchemas } = require('../utils/validation');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/:id/reviews', authMiddleware, validate(productSchemas.addReview), productController.addReview);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, validate(productSchemas.create), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validate(productSchemas.update), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
