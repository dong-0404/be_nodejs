const BaseController = require('./base.controller');
const { body, query, param } = require('express-validator');
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
            body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
        ];
    }

    static updateItemValidationRules() {
        return [
            param('itemId').isInt().withMessage('Item ID must be an integer'),
            body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
        ];
    }

    static removeItemValidationRules() {
        return [
            param('itemId').isInt().withMessage('Item ID must be an integer')
        ];
    }

    static getCartValidationRules() {
        return [
            param('cartId').isInt().withMessage('Cart ID must be an integer')
        ];
    }

    // Get user's cart
    async getUserCart(req, res) {
        try {
            const userId = req.user.id;
            const cart = await this.cartService.getUserCart(userId);
            
            if (!cart) {
                return this.success(res, { items: [], totalItems: 0, totalPrice: 0 }, 'Cart is empty');
            }

            const summary = await this.cartService.getCartSummary(cart.id);
            return this.success(res, { cart, summary }, 'Cart retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get user cart', 500);
        }
    }

    // Get or create user's cart
    async getOrCreateUserCart(req, res) {
        try {
            const userId = req.user.id;
            const cart = await this.cartService.getOrCreateUserCart(userId);
            const summary = await this.cartService.getCartSummary(cart.id);
            
            return this.success(res, { cart, summary }, 'Cart retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get or create user cart', 500);
        }
    }

    // Get guest cart
    async getGuestCart(req, res) {
        try {
            const { sessionId } = req.params;
            const cart = await this.cartService.getGuestCart(sessionId);
            
            if (!cart) {
                return this.success(res, { items: [], totalItems: 0, totalPrice: 0 }, 'Cart is empty');
            }

            const summary = await this.cartService.getCartSummary(cart.id);
            return this.success(res, { cart, summary }, 'Guest cart retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get guest cart', 500);
        }
    }

    // Get or create guest cart
    async getOrCreateGuestCart(req, res) {
        try {
            const { sessionId } = req.params;
            const cart = await this.cartService.getOrCreateGuestCart(sessionId);
            const summary = await this.cartService.getCartSummary(cart.id);
            
            return this.success(res, { cart, summary }, 'Guest cart retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get or create guest cart', 500);
        }
    }

    // Add item to user's cart
    async addToUserCart(req, res) {
        try {
            const userId = req.user.id;
            const { productVariantId, quantity = 1 } = req.body;

            // Get or create user's cart
            const cart = await this.cartService.getOrCreateUserCart(userId);
            
            // Add item to cart
            const updatedCart = await this.cartService.addToCart(cart.id, productVariantId, quantity);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Item added to cart successfully');
        } catch (error) {
            const status = error.message.includes('not found') || error.message.includes('Insufficient stock') ? 400 : 500;
            return this.error(res, error.message, 'Failed to add item to cart', status);
        }
    }

    // Add item to guest cart
    async addToGuestCart(req, res) {
        try {
            const { sessionId } = req.params;
            const { productVariantId, quantity = 1 } = req.body;

            // Get or create guest cart
            const cart = await this.cartService.getOrCreateGuestCart(sessionId);
            
            // Add item to cart
            const updatedCart = await this.cartService.addToCart(cart.id, productVariantId, quantity);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Item added to guest cart successfully');
        } catch (error) {
            const status = error.message.includes('not found') || error.message.includes('Insufficient stock') ? 400 : 500;
            return this.error(res, error.message, 'Failed to add item to guest cart', status);
        }
    }

    // Update item quantity in user's cart
    async updateUserCartItem(req, res) {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;

            const updatedCart = await this.cartService.updateItemQuantity(itemId, quantity);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Item quantity updated successfully');
        } catch (error) {
            const status = error.message.includes('not found') || error.message.includes('Insufficient stock') ? 400 : 500;
            return this.error(res, error.message, 'Failed to update item quantity', status);
        }
    }

    // Update item quantity in guest cart
    async updateGuestCartItem(req, res) {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;

            const updatedCart = await this.cartService.updateItemQuantity(itemId, quantity);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Guest cart item quantity updated successfully');
        } catch (error) {
            const status = error.message.includes('not found') || error.message.includes('Insufficient stock') ? 400 : 500;
            return this.error(res, error.message, 'Failed to update guest cart item quantity', status);
        }
    }

    // Remove item from user's cart
    async removeFromUserCart(req, res) {
        try {
            const { itemId } = req.params;

            const updatedCart = await this.cartService.removeFromCart(itemId);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Item removed from cart successfully');
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            return this.error(res, error.message, 'Failed to remove item from cart', status);
        }
    }

    // Remove item from guest cart
    async removeFromGuestCart(req, res) {
        try {
            const { itemId } = req.params;

            const updatedCart = await this.cartService.removeFromCart(itemId);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Item removed from guest cart successfully');
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            return this.error(res, error.message, 'Failed to remove item from guest cart', status);
        }
    }

    // Clear user's cart
    async clearUserCart(req, res) {
        try {
            const userId = req.user.id;
            const cart = await this.cartService.getUserCart(userId);
            
            if (!cart) {
                return this.success(res, { items: [], totalItems: 0, totalPrice: 0 }, 'Cart is already empty');
            }

            const clearedCart = await this.cartService.clearCart(cart.id);
            const summary = await this.cartService.getCartSummary(clearedCart.id);
            
            return this.success(res, { cart: clearedCart, summary }, 'Cart cleared successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to clear cart', 500);
        }
    }

    // Clear guest cart
    async clearGuestCart(req, res) {
        try {
            const { sessionId } = req.params;
            const cart = await this.cartService.getGuestCart(sessionId);
            
            if (!cart) {
                return this.success(res, { items: [], totalItems: 0, totalPrice: 0 }, 'Cart is already empty');
            }

            const clearedCart = await this.cartService.clearCart(cart.id);
            const summary = await this.cartService.getCartSummary(clearedCart.id);
            
            return this.success(res, { cart: clearedCart, summary }, 'Guest cart cleared successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to clear guest cart', 500);
        }
    }

    // Convert guest cart to user cart
    async convertGuestCartToUserCart(req, res) {
        try {
            const userId = req.user.id;
            const { sessionId } = req.body;

            const convertedCart = await this.cartService.convertGuestCartToUserCart(sessionId, userId);
            const summary = await this.cartService.getCartSummary(convertedCart.id);
            
            return this.success(res, { cart: convertedCart, summary }, 'Guest cart converted to user cart successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to convert guest cart to user cart', 500);
        }
    }

    // Get cart by ID
    async getCartById(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await this.cartService.getCartById(cartId);
            const summary = await this.cartService.getCartSummary(cart.id);
            
            return this.success(res, { cart, summary }, 'Cart retrieved successfully');
        } catch (error) {
            const status = error.message === 'Cart not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to get cart', status);
        }
    }

    // Validate cart items
    async validateCartItems(req, res) {
        try {
            const { cartId } = req.params;
            const validationResults = await this.cartService.validateCartItems(cartId);
            
            return this.success(res, validationResults, 'Cart validation completed');
        } catch (error) {
            const status = error.message === 'Cart not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to validate cart items', status);
        }
    }

    // Update cart item prices
    async updateCartItemPrices(req, res) {
        try {
            const { cartId } = req.params;
            const updatedCart = await this.cartService.updateCartItemPrices(cartId);
            const summary = await this.cartService.getCartSummary(updatedCart.id);
            
            return this.success(res, { cart: updatedCart, summary }, 'Cart item prices updated successfully');
        } catch (error) {
            const status = error.message === 'Cart not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to update cart item prices', status);
        }
    }

    // Get cart statistics
    async getCartStats(req, res) {
        try {
            const stats = await this.cartService.getCartStats();
            return this.success(res, stats, 'Cart statistics retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get cart statistics', 500);
        }
    }

    // Abandon cart
    async abandonCart(req, res) {
        try {
            const { cartId } = req.params;
            const abandonedCart = await this.cartService.abandonCart(cartId);
            
            return this.success(res, abandonedCart, 'Cart abandoned successfully');
        } catch (error) {
            const status = error.message === 'Cart not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to abandon cart', status);
        }
    }

    // Convert cart to order
    async convertCartToOrder(req, res) {
        try {
            const { cartId } = req.params;
            const convertedCart = await this.cartService.convertCartToOrder(cartId);
            
            return this.success(res, convertedCart, 'Cart converted to order successfully');
        } catch (error) {
            const status = error.message === 'Cart not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to convert cart to order', status);
        }
    }
}

module.exports = CartController;
