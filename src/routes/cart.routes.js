const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Initialize controller
const cartController = new CartController();

// User cart routes (authentication required)
router.get('/user/cart',
    authMiddleware.authenticate,
    cartController.getUserCart
);

router.get('/user/cart/create',
    authMiddleware.authenticate,
    cartController.getOrCreateUserCart
);

router.post('/user/cart/items',
    authMiddleware.authenticate,
    CartController.addItemValidationRules(),
    cartController.validate,
    cartController.addToUserCart
);

router.put('/user/cart/items/:itemId',
    authMiddleware.authenticate,
    CartController.updateItemValidationRules(),
    cartController.validate,
    cartController.updateUserCartItem
);

router.delete('/user/cart/items/:itemId',
    authMiddleware.authenticate,
    CartController.removeItemValidationRules(),
    cartController.validate,
    cartController.removeFromUserCart
);

router.delete('/user/cart/clear',
    authMiddleware.authenticate,
    cartController.clearUserCart
);

// Guest cart routes (no authentication required)
router.get('/guest/cart/:sessionId',
    cartController.getGuestCart
);

router.get('/guest/cart/:sessionId/create',
    cartController.getOrCreateGuestCart
);

router.post('/guest/cart/:sessionId/items',
    CartController.addItemValidationRules(),
    cartController.validate,
    cartController.addToGuestCart
);

router.put('/guest/cart/items/:itemId',
    CartController.updateItemValidationRules(),
    cartController.validate,
    cartController.updateGuestCartItem
);

router.delete('/guest/cart/items/:itemId',
    CartController.removeItemValidationRules(),
    cartController.validate,
    cartController.removeFromGuestCart
);

router.delete('/guest/cart/:sessionId/clear',
    cartController.clearGuestCart
);

// Cart conversion (guest to user)
router.post('/cart/convert',
    authMiddleware.authenticate,
    cartController.convertGuestCartToUserCart
);

// General cart routes
router.get('/cart/:cartId',
    CartController.getCartValidationRules(),
    cartController.validate,
    cartController.getCartById
);

router.get('/cart/:cartId/validate',
    CartController.getCartValidationRules(),
    cartController.validate,
    cartController.validateCartItems
);

router.put('/cart/:cartId/update-prices',
    CartController.getCartValidationRules(),
    cartController.validate,
    cartController.updateCartItemPrices
);

// Admin routes
router.get('/admin/cart/stats',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    cartController.getCartStats
);

router.patch('/cart/:cartId/abandon',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    CartController.getCartValidationRules(),
    cartController.validate,
    cartController.abandonCart
);

router.patch('/cart/:cartId/convert-to-order',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    CartController.getCartValidationRules(),
    cartController.validate,
    cartController.convertCartToOrder
);

module.exports = router;
