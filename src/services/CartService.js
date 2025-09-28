const ServiceInterface = require('../interfaces/service.interface');

class CartService extends ServiceInterface {
    constructor(cartRepository, productRepository) {
        super();
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // Implement ServiceInterface methods
    async getAll() {
        return await this.cartRepository.findAll();
    }

    async getById(id) {
        return await this.cartRepository.findById(id);
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
        
        if (data.userId && data.sessionId) {
            errors.push('Cart cannot have both userId and sessionId');
        }
        
        if (!data.userId && !data.sessionId) {
            errors.push('Cart must have either userId or sessionId');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Get or create cart for user
    async getOrCreateUserCart(userId) {
        try {
            return await this.cartRepository.getOrCreateUserCart(userId);
        } catch (error) {
            throw new Error(`Failed to get or create user cart: ${error.message}`);
        }
    }

    // Get or create cart for guest
    async getOrCreateGuestCart(sessionId) {
        try {
            return await this.cartRepository.getOrCreateGuestCart(sessionId);
        } catch (error) {
            throw new Error(`Failed to get or create guest cart: ${error.message}`);
        }
    }

    // Add item to cart
    async addToCart(cartId, productVariantId, quantity = 1) {
        try {
            // Validate product variant exists and is active
            const productVariant = await this.productRepository.ProductVariant.findByPk(productVariantId, {
                include: [
                    {
                        model: this.productRepository.Product,
                        as: 'product',
                        where: { isActive: true }
                    }
                ]
            });

            if (!productVariant) {
                throw new Error('Product variant not found or product is inactive');
            }

            if (!productVariant.isActive) {
                throw new Error('Product variant is inactive');
            }

            // Check stock availability
            if (productVariant.stockQuantity < quantity) {
                throw new Error(`Insufficient stock. Available: ${productVariant.stockQuantity}`);
            }

            // Add item to cart
            const cartItem = await this.cartRepository.addItem(
                cartId,
                productVariantId,
                quantity,
                productVariant.price
            );

            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Failed to add item to cart: ${error.message}`);
        }
    }

    // Update item quantity in cart
    async updateItemQuantity(cartItemId, quantity) {
        try {
            if (quantity < 0) {
                throw new Error('Quantity cannot be negative');
            }

            const cartItem = await this.cartRepository.CartItem.findByPk(cartItemId, {
                include: [
                    {
                        model: this.cartRepository.ProductVariant,
                        as: 'productVariant'
                    }
                ]
            });

            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            // Check stock availability if increasing quantity
            if (quantity > cartItem.quantity) {
                const additionalQuantity = quantity - cartItem.quantity;
                if (cartItem.productVariant.stockQuantity < additionalQuantity) {
                    throw new Error(`Insufficient stock. Available: ${cartItem.productVariant.stockQuantity}`);
                }
            }

            if (quantity === 0) {
                await this.cartRepository.removeItem(cartItemId);
                return await this.getCartById(cartItem.cartId);
            }

            await this.cartRepository.updateItemQuantity(cartItemId, quantity);
            return await this.getCartById(cartItem.cartId);
        } catch (error) {
            throw new Error(`Failed to update item quantity: ${error.message}`);
        }
    }

    // Remove item from cart
    async removeFromCart(cartItemId) {
        try {
            const cartItem = await this.cartRepository.CartItem.findByPk(cartItemId);
            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            const cartId = cartItem.cartId;
            await this.cartRepository.removeItem(cartItemId);
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Failed to remove item from cart: ${error.message}`);
        }
    }

    // Clear cart
    async clearCart(cartId) {
        try {
            await this.cartRepository.clearCart(cartId);
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Failed to clear cart: ${error.message}`);
        }
    }

    // Get cart by ID with full details
    async getCartById(cartId) {
        try {
            const cart = await this.cartRepository.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error(`Failed to get cart: ${error.message}`);
        }
    }

    // Get cart summary
    async getCartSummary(cartId) {
        try {
            return await this.cartRepository.getCartSummary(cartId);
        } catch (error) {
            throw new Error(`Failed to get cart summary: ${error.message}`);
        }
    }

    // Convert guest cart to user cart
    async convertGuestCartToUserCart(sessionId, userId) {
        try {
            return await this.cartRepository.convertGuestCartToUserCart(sessionId, userId);
        } catch (error) {
            throw new Error(`Failed to convert guest cart to user cart: ${error.message}`);
        }
    }

    // Get user's active cart
    async getUserCart(userId) {
        try {
            const cart = await this.cartRepository.findByUserId(userId);
            return cart;
        } catch (error) {
            throw new Error(`Failed to get user cart: ${error.message}`);
        }
    }

    // Get guest cart
    async getGuestCart(sessionId) {
        try {
            const cart = await this.cartRepository.findBySessionId(sessionId);
            return cart;
        } catch (error) {
            throw new Error(`Failed to get guest cart: ${error.message}`);
        }
    }

    // Validate cart items (check stock, prices, etc.)
    async validateCartItems(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            const validationResults = {
                isValid: true,
                errors: [],
                warnings: []
            };

            for (const item of cart.items) {
                const productVariant = item.productVariant;
                
                // Check if product variant is still active
                if (!productVariant.isActive || !productVariant.product.isActive) {
                    validationResults.errors.push(`Product "${productVariant.product.name}" is no longer available`);
                    validationResults.isValid = false;
                }

                // Check stock availability
                if (productVariant.stockQuantity < item.quantity) {
                    validationResults.errors.push(`Insufficient stock for "${productVariant.product.name}". Available: ${productVariant.stockQuantity}, Requested: ${item.quantity}`);
                    validationResults.isValid = false;
                }

                // Check if price has changed
                if (productVariant.price !== item.priceAtAdd) {
                    validationResults.warnings.push(`Price for "${productVariant.product.name}" has changed from ${item.priceAtAdd} to ${productVariant.price}`);
                }
            }

            return validationResults;
        } catch (error) {
            throw new Error(`Failed to validate cart items: ${error.message}`);
        }
    }

    // Update cart item prices to current prices
    async updateCartItemPrices(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            
            for (const item of cart.items) {
                const currentPrice = item.productVariant.price;
                if (currentPrice !== item.priceAtAdd) {
                    await this.cartRepository.CartItem.update(
                        { priceAtAdd: currentPrice },
                        { where: { id: item.id } }
                    );
                }
            }

            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Failed to update cart item prices: ${error.message}`);
        }
    }

    // Get cart statistics
    async getCartStats() {
        try {
            const db = this.cartRepository.db;
            const stats = await db.Cart.findAll({
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalCarts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "status" = \'active\' THEN 1 END')), 'activeCarts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "status" = \'converted\' THEN 1 END')), 'convertedCarts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "status" = \'abandoned\' THEN 1 END')), 'abandonedCarts']
                ],
                raw: true
            });

            return stats[0] || {
                totalCarts: 0,
                activeCarts: 0,
                convertedCarts: 0,
                abandonedCarts: 0
            };
        } catch (error) {
            throw new Error(`Failed to get cart statistics: ${error.message}`);
        }
    }

    // Abandon cart (mark as abandoned)
    async abandonCart(cartId) {
        try {
            return await this.cartRepository.update(cartId, { status: 'abandoned' });
        } catch (error) {
            throw new Error(`Failed to abandon cart: ${error.message}`);
        }
    }

    // Convert cart to order (mark as converted)
    async convertCartToOrder(cartId) {
        try {
            return await this.cartRepository.update(cartId, { status: 'converted' });
        } catch (error) {
            throw new Error(`Failed to convert cart to order: ${error.message}`);
        }
    }
}

module.exports = CartService;
