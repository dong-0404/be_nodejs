const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

const cartController = new CartController();

// All cart routes require authentication
router.get('/cart',
    authMiddleware.authenticate,
    cartController.getCart
);

router.post('/cart/items',
    authMiddleware.authenticate,
    CartController.addItemValidationRules(),
    cartController.validate,
    cartController.addItem
);

router.put('/cart/items/:itemId',
    authMiddleware.authenticate,
    CartController.updateItemValidationRules(),
    cartController.validate,
    cartController.updateItem
);

router.delete('/cart/items/:itemId',
    authMiddleware.authenticate,
    cartController.removeItem
);

router.delete('/cart',
    authMiddleware.authenticate,
    cartController.clearCart
);

module.exports = router;


