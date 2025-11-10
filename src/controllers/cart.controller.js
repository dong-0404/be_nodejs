const BaseController = require('./base.controller');
const { body, param } = require('express-validator');
const container = require('../di-container/di-container');

class CartController extends BaseController {
    constructor() {
        super();
        this.cartService = container.resolve('cartService');
    }

    // Validation rules
    static addItemValidationRules() {
        return [
            body('productVariantId').isInt().withMessage('Product variant ID must be an integer'),
            body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
        ];
    }

    static updateItemValidationRules() {
        return [
            param('itemId').isInt().withMessage('Item ID must be an integer'),
            body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
        ];
    }

    // Get user's cart
    async getCart(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.cartService.getCart(userId);
            return this.success(res, result, 'Cart retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Add item to cart
    async addItem(req, res) {
        try {
            const userId = req.user.id;
            const { productVariantId, quantity = 1 } = req.body;

            const result = await this.cartService.addItem(userId, productVariantId, quantity);
            return this.success(res, result, 'Item added to cart successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Update item quantity
    async updateItem(req, res) {
        try {
            const userId = req.user.id;
            const { itemId } = req.params;
            const { quantity } = req.body;

            const result = await this.cartService.updateItem(userId, parseInt(itemId), quantity);
            return this.success(res, result, 'Cart item updated successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Remove item from cart
    async removeItem(req, res) {
        try {
            const userId = req.user.id;
            const { itemId } = req.params;

            const result = await this.cartService.removeItem(userId, parseInt(itemId));
            return this.success(res, result, 'Item removed from cart successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Clear cart
    async clearCart(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.cartService.clearCart(userId);
            return this.success(res, result, 'Cart cleared successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = CartController;


