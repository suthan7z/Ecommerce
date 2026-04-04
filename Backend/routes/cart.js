const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cartSchemas } = require('../utils/validation');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', validate(cartSchemas.addToCart), cartController.addToCart);
router.put('/update', validate(cartSchemas.updateCart), cartController.updateCartItem);
router.post('/remove', validate(cartSchemas.removeFromCart), cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;
