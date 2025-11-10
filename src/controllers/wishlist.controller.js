const BaseController = require('./base.controller');
const { body, param } = require('express-validator');
const container = require('../di-container/di-container');

class WishlistController extends BaseController {
    constructor() {
        super();
        this.wishlistService = container.resolve('wishlistService');
    }

    // Validation rules
    static addProductValidationRules() {
        return [
            body('productId').isInt().withMessage('Product ID must be an integer')
        ];
    }

    // Get user's wishlist
    async getWishlist(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.wishlistService.getWishlist(userId);
            return this.success(res, result, 'Wishlist retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Add product to wishlist
    async addProduct(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.body;

            const result = await this.wishlistService.addProduct(userId, productId);
            return this.success(res, result, 'Product added to wishlist successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Remove product from wishlist
    async removeProduct(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;

            const result = await this.wishlistService.removeProduct(userId, parseInt(productId));
            return this.success(res, result, 'Product removed from wishlist successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Remove wishlist item by ID
    async removeItem(req, res) {
        try {
            const userId = req.user.id;
            const { itemId } = req.params;

            const result = await this.wishlistService.removeItem(userId, parseInt(itemId));
            return this.success(res, result, 'Item removed from wishlist successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Check if product is in wishlist
    async checkProduct(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;

            const isInWishlist = await this.wishlistService.isProductInWishlist(userId, parseInt(productId));
            return this.success(res, { isInWishlist }, 'Check completed successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get all user wishlists
    async getUserWishlists(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.wishlistService.getUserWishlists(userId);
            return this.success(res, result, 'User wishlists retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = WishlistController;


