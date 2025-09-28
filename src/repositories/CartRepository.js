const { Op } = require('sequelize');
const RepositoryInterface = require('../interfaces/repository.interface');

class CartRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Cart = db.Cart;
        this.CartItem = db.CartItem;
        this.ProductVariant = db.ProductVariant;
        this.Product = db.Product;
        this.ProductImage = db.ProductImage;
        this.Brand = db.Brand;
        this.model = db.Cart; // For interface compatibility
    }

    // Implement RepositoryInterface methods
    async getAll() {
        return await this.findAll();
    }

    async getById(id) {
        return await this.findById(id);
    }

    async count() {
        return await this.Cart.count();
    }

    // Create a new cart
    async create(cartData) {
        try {
            const cart = await this.Cart.create(cartData);
            return await this.findById(cart.id);
        } catch (error) {
            throw new Error(`Failed to create cart: ${error.message}`);
        }
    }

    // Find cart by ID with all related data
    async findById(id) {
        try {
            const cart = await this.Cart.findByPk(id, {
                include: [
                    {
                        model: this.db.CartItem,
                        as: 'items',
                        include: [
                            {
                                model: this.db.ProductVariant,
                                as: 'productVariant',
                                include: [
                                    {
                                        model: this.db.Product,
                                        as: 'product',
                                        include: [
                                            {
                                                model: this.db.Brand,
                                                as: 'brand',
                                                attributes: ['id', 'name', 'slug']
                                            },
                                            {
                                                model: this.db.ProductImage,
                                                as: 'images',
                                                attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
                                                where: { isPrimary: true },
                                                required: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            return cart;
        } catch (error) {
            throw new Error(`Failed to find cart: ${error.message}`);
        }
    }

    // Find active cart by user ID
    async findByUserId(userId) {
        try {
            const cart = await this.Cart.findOne({
                where: { 
                    userId: userId,
                    status: 'active'
                },
                include: [
                    {
                        model: this.db.CartItem,
                        as: 'items',
                        include: [
                            {
                                model: this.db.ProductVariant,
                                as: 'productVariant',
                                include: [
                                    {
                                        model: this.db.Product,
                                        as: 'product',
                                        include: [
                                            {
                                                model: this.db.Brand,
                                                as: 'brand',
                                                attributes: ['id', 'name', 'slug']
                                            },
                                            {
                                                model: this.db.ProductImage,
                                                as: 'images',
                                                attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
                                                where: { isPrimary: true },
                                                required: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            return cart;
        } catch (error) {
            throw new Error(`Failed to find cart by user ID: ${error.message}`);
        }
    }

    // Find active cart by session ID (for guest users)
    async findBySessionId(sessionId) {
        try {
            const cart = await this.Cart.findOne({
                where: { 
                    sessionId: sessionId,
                    status: 'active'
                },
                include: [
                    {
                        model: this.db.CartItem,
                        as: 'items',
                        include: [
                            {
                                model: this.db.ProductVariant,
                                as: 'productVariant',
                                include: [
                                    {
                                        model: this.db.Product,
                                        as: 'product',
                                        include: [
                                            {
                                                model: this.db.Brand,
                                                as: 'brand',
                                                attributes: ['id', 'name', 'slug']
                                            },
                                            {
                                                model: this.db.ProductImage,
                                                as: 'images',
                                                attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
                                                where: { isPrimary: true },
                                                required: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            return cart;
        } catch (error) {
            throw new Error(`Failed to find cart by session ID: ${error.message}`);
        }
    }

    // Get or create active cart for user
    async getOrCreateUserCart(userId) {
        try {
            let cart = await this.findByUserId(userId);
            
            if (!cart) {
                cart = await this.create({
                    userId: userId,
                    status: 'active'
                });
            }
            
            return cart;
        } catch (error) {
            throw new Error(`Failed to get or create user cart: ${error.message}`);
        }
    }

    // Get or create active cart for guest
    async getOrCreateGuestCart(sessionId) {
        try {
            let cart = await this.findBySessionId(sessionId);
            
            if (!cart) {
                cart = await this.create({
                    sessionId: sessionId,
                    status: 'active'
                });
            }
            
            return cart;
        } catch (error) {
            throw new Error(`Failed to get or create guest cart: ${error.message}`);
        }
    }

    // Add item to cart
    async addItem(cartId, productVariantId, quantity, priceAtAdd) {
        try {
            // Check if item already exists in cart
            const existingItem = await this.db.CartItem.findOne({
                where: {
                    cartId: cartId,
                    productVariantId: productVariantId
                }
            });

            if (existingItem) {
                // Update quantity
                existingItem.quantity += quantity;
                await existingItem.save();
                return existingItem;
            } else {
                // Create new item
                const cartItem = await this.db.CartItem.create({
                    cartId: cartId,
                    productVariantId: productVariantId,
                    quantity: quantity,
                    priceAtAdd: priceAtAdd
                });
                return cartItem;
            }
        } catch (error) {
            throw new Error(`Failed to add item to cart: ${error.message}`);
        }
    }

    // Update item quantity
    async updateItemQuantity(cartItemId, quantity) {
        try {
            if (quantity <= 0) {
                return await this.removeItem(cartItemId);
            }

            const cartItem = await this.db.CartItem.findByPk(cartItemId);
            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            cartItem.quantity = quantity;
            await cartItem.save();
            return cartItem;
        } catch (error) {
            throw new Error(`Failed to update item quantity: ${error.message}`);
        }
    }

    // Remove item from cart
    async removeItem(cartItemId) {
        try {
            const deleted = await this.db.CartItem.destroy({
                where: { id: cartItemId }
            });
            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to remove item from cart: ${error.message}`);
        }
    }

    // Clear all items from cart
    async clearCart(cartId) {
        try {
            const deleted = await this.db.CartItem.destroy({
                where: { cartId: cartId }
            });
            return deleted;
        } catch (error) {
            throw new Error(`Failed to clear cart: ${error.message}`);
        }
    }

    // Update cart
    async update(id, updateData) {
        try {
            await this.db.Cart.update(updateData, { where: { id } });
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Failed to update cart: ${error.message}`);
        }
    }

    // Delete cart
    async delete(id) {
        try {
            // First clear all items
            await this.clearCart(id);
            
            // Then delete the cart
            const deleted = await this.Cart.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to delete cart: ${error.message}`);
        }
    }

    // Get cart summary (total items, total price)
    async getCartSummary(cartId) {
        try {
            const cart = await this.findById(cartId);
            if (!cart) {
                return {
                    totalItems: 0,
                    totalPrice: 0,
                    items: []
                };
            }

            const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);

            return {
                totalItems,
                totalPrice,
                items: cart.items
            };
        } catch (error) {
            throw new Error(`Failed to get cart summary: ${error.message}`);
        }
    }

    // Convert guest cart to user cart
    async convertGuestCartToUserCart(sessionId, userId) {
        try {
            const guestCart = await this.findBySessionId(sessionId);
            if (!guestCart) {
                return null;
            }

            // Check if user already has an active cart
            const userCart = await this.findByUserId(userId);
            
            if (userCart) {
                // Merge guest cart items into user cart
                for (const item of guestCart.items) {
                    await this.addItem(userCart.id, item.productVariantId, item.quantity, item.priceAtAdd);
                }
                
                // Delete guest cart
                await this.delete(guestCart.id);
                
                return await this.findById(userCart.id);
            } else {
                // Transfer guest cart to user
                await this.db.Cart.update(
                    { userId: userId, sessionId: null },
                    { where: { id: guestCart.id } }
                );
                
                return await this.findById(guestCart.id);
            }
        } catch (error) {
            throw new Error(`Failed to convert guest cart to user cart: ${error.message}`);
        }
    }

    // Get all carts with pagination
    async findAll(options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                userId,
                status,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = options;

            const offset = (page - 1) * limit;
            const where = {};

            if (userId) where.userId = userId;
            if (status) where.status = status;

            const { count, rows } = await this.Cart.findAndCountAll({
                where,
                include: [
                    {
                        model: this.db.CartItem,
                        as: 'items',
                        include: [
                            {
                                model: this.db.ProductVariant,
                                as: 'productVariant',
                                include: [
                                    {
                                        model: this.db.Product,
                                        as: 'product',
                                        include: [
                                            {
                                                model: this.db.Brand,
                                                as: 'brand',
                                                attributes: ['id', 'name', 'slug']
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true
            });

            return {
                carts: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Failed to find carts: ${error.message}`);
        }
    }
}

module.exports = CartRepository;
