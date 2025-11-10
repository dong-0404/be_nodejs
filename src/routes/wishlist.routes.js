const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middleware/auth.middleware');

const wishlistController = new WishlistController();

// All wishlist routes require authentication
router.get('/wishlist',
    authMiddleware.authenticate,
    wishlistController.getWishlist
);

router.post('/wishlist/items',
    authMiddleware.authenticate,
    WishlistController.addProductValidationRules(),
    wishlistController.validate,
    wishlistController.addProduct
);

router.delete('/wishlist/items/product/:productId',
    authMiddleware.authenticate,
    wishlistController.removeProduct
);

router.delete('/wishlist/items/:itemId',
    authMiddleware.authenticate,
    wishlistController.removeItem
);

router.get('/wishlist/check/:productId',
    authMiddleware.authenticate,
    wishlistController.checkProduct
);

router.get('/wishlists',
    authMiddleware.authenticate,
    wishlistController.getUserWishlists
);

module.exports = router;


