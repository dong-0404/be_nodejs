const ServiceInterface = require('../interfaces/service.interface');

class CartService extends ServiceInterface {
    constructor(cartRepository, productRepository) {
        super();
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // Get user's cart
    async getCart(userId) {
        try {
            const cart = await this.cartRepository.getOrCreateCart(userId);

            // Ensure cart has items array even if empty
            const cartData = cart.toJSON ? cart.toJSON() : cart;
            if (!cartData.items) {
                cartData.items = [];
            }

            // Calculate totals
            const totals = await this.cartRepository.calculateCartTotal(cart.id);

            return {
                cart: cartData,
                totals
            };
        } catch (error) {
            throw new Error(`Failed to get cart: ${error.message}`);
        }
    }

    // Add item to cart
    async addItem(userId, productVariantId, quantity = 1) {
        try {
            // Get productId from variant first
            const productId = await this.getProductIdFromVariant(productVariantId);
            
            // Validate product variant exists and is active
            const product = await this.productRepository.getById(productId);
            
            if (!product) {
                throw new Error('Product not found');
            }

            const variant = product.variants?.find(v => v.id === productVariantId);
            if (!variant) {
                throw new Error('Product variant not found');
            }
            
            if (!variant.isActive) {
                throw new Error('Product variant not available');
            }

            // Check stock
            if (variant.stockQuantity < quantity) {
                throw new Error('Insufficient stock');
            }

            // Get or create cart
            const cart = await this.cartRepository.getOrCreateCart(userId);

            // Check existing item in cart
            const existingItem = await this.cartRepository.findCartItem(cart.id, productVariantId);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (variant.stockQuantity < newQuantity) {
                    throw new Error('Insufficient stock');
                }

                const updatedItem = await this.cartRepository.updateItemQuantity(existingItem.id, newQuantity);
                const updatedCart = await this.cartRepository.getCartWithItems(cart.id);
                const totals = await this.cartRepository.calculateCartTotal(cart.id);

                return {
                    item: updatedItem.toJSON ? updatedItem.toJSON() : updatedItem,
                    cart: updatedCart.toJSON ? updatedCart.toJSON() : updatedCart,
                    totals
                };
            }

            // Create new cart item
            const item = await this.cartRepository.addItem(
                cart.id,
                productVariantId,
                quantity,
                variant.price
            );

            const updatedCart = await this.cartRepository.getCartWithItems(cart.id);
            const totals = await this.cartRepository.calculateCartTotal(cart.id);

            return {
                item: item.toJSON ? item.toJSON() : item,
                cart: updatedCart.toJSON ? updatedCart.toJSON() : updatedCart,
                totals
            };
        } catch (error) {
            throw error;
        }
    }

    // Update item quantity
    async updateItem(userId, itemId, quantity) {
        try {
            if (quantity < 1) {
                throw new Error('Quantity must be at least 1');
            }

            // Get cart item
            const item = await this.cartRepository.getCartItemById(itemId);
            if (!item) {
                throw new Error('Cart item not found');
            }

            // Verify cart belongs to user
            const cart = await this.cartRepository.getCartOwner(item.cartId);
            if (!cart || cart.userId !== userId) {
                throw new Error('Unauthorized');
            }

            // Check stock
            const variant = await this.getProductVariant(item.productVariantId);
            if (variant.stockQuantity < quantity) {
                throw new Error('Insufficient stock');
            }

            // Update quantity
            const updatedItem = await this.cartRepository.updateItemQuantity(itemId, quantity);

            // Get updated cart
            const cartId = item.cartId;
            const updatedCart = await this.cartRepository.getCartWithItems(cartId);
            const totals = await this.cartRepository.calculateCartTotal(cartId);

            return {
                item: updatedItem.toJSON(),
                cart: updatedCart.toJSON(),
                totals
            };
        } catch (error) {
            throw error;
        }
    }

    // Remove item from cart
    async removeItem(userId, itemId) {
        try {
            // Get cart item
            const item = await this.cartRepository.getCartItemById(itemId);
            if (!item) {
                throw new Error('Cart item not found');
            }

            // Verify cart belongs to user
            const cart = await this.cartRepository.getCartOwner(item.cartId);
            if (!cart || cart.userId !== userId) {
                throw new Error('Unauthorized');
            }

            // Remove item
            await this.cartRepository.removeItem(itemId);

            // Get updated cart
            const updatedCart = await this.cartRepository.getCartWithItems(cart.id);
            const totals = await this.cartRepository.calculateCartTotal(cart.id);

            return {
                cart: updatedCart.toJSON(),
                totals
            };
        } catch (error) {
            throw error;
        }
    }

    // Clear cart
    async clearCart(userId) {
        try {
            const cart = await this.cartRepository.getOrCreateCart(userId);
            await this.cartRepository.clearCart(cart.id);

            const updatedCart = await this.cartRepository.getCartWithItems(cart.id);
            const totals = await this.cartRepository.calculateCartTotal(cart.id);

            return {
                cart: updatedCart.toJSON(),
                totals
            };
        } catch (error) {
            throw new Error(`Failed to clear cart: ${error.message}`);
        }
    }

    // Helper methods
    async getProductIdFromVariant(variantId) {
        try {
            const variant = await this.cartRepository.db.ProductVariant.findByPk(variantId);
            if (!variant) {
                throw new Error('Product variant not found');
            }
            return variant.productId;
        } catch (error) {
            throw new Error(`Failed to get product ID: ${error.message}`);
        }
    }

    async getProductVariant(variantId) {
        try {
            const variant = await this.cartRepository.db.ProductVariant.findByPk(variantId);
            if (!variant) {
                throw new Error('Product variant not found');
            }
            return variant;
        } catch (error) {
            throw new Error(`Failed to get product variant: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.cartRepository.getAll();
    }

    async getById(id) {
        return await this.cartRepository.getById(id);
    }

    async create(data) {
        return await this.cartRepository.create(data);
    }

    async update(id, data) {
        return await this.cartRepository.update(id, data);
    }

    async delete(id) {
        return await this.cartRepository.delete(id);
    }

    async validate(data) {
        const errors = [];
        if (!data.userId) {
            errors.push('User ID is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = CartService;


