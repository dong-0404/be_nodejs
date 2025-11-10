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
        this.model = db.Cart;
    }

    // Get or create cart for user
    async getOrCreateCart(userId) {
        try {
            let cart = await this.Cart.findOne({
                where: {
                    userId,
                    status: 'active'
                },
                include: [
                    {
                        model: this.CartItem,
                        as: 'items',
                        required: false,
                        attributes: ['id', 'cartId', 'productVariantId', 'quantity', 'priceAtAdd', 'createdAt', 'updatedAt'],
                        include: [
                            {
                                model: this.ProductVariant,
                                as: 'productVariant',
                                required: false,
                                include: [
                                    {
                                        model: this.Product,
                                        as: 'product',
                                        required: false,
                                        include: [
                                            {
                                                model: this.ProductImage,
                                                as: 'images',
                                                attributes: ['id', 'imageUrl', 'isPrimary'],
                                                where: { isPrimary: true },
                                                required: false
                                            }
                                        ],
                                        attributes: ['id', 'name', 'slug']
                                    }
                                ],
                                attributes: ['id', 'sku', 'color', 'size', 'price', 'originalPrice']
                            }
                        ]
                    }
                ]
            });

            if (!cart) {
                cart = await this.Cart.create({
                    userId,
                    status: 'active'
                });
                cart = await this.getCartWithItems(cart.id);
            }

            if (cart && !cart.items) {
                cart.items = [];
            }

            return cart;
        } catch (error) {
            throw new Error(`Failed to get or create cart: ${error.message}`);
        }
    }

    // Get cart with items
    async getCartWithItems(cartId) {
        try {
            const cart = await this.Cart.findByPk(cartId, {
                include: [
                    {
                        model: this.CartItem,
                        as: 'items',
                        required: false, // Left join để không bị lỗi khi không có items
                        attributes: ['id', 'cartId', 'productVariantId', 'quantity', 'priceAtAdd', 'createdAt', 'updatedAt'],
                        include: [
                            {
                                model: this.ProductVariant,
                                as: 'productVariant',
                                required: false, // Left join để không bị lỗi khi variant bị xóa
                                include: [
                                    {
                                        model: this.Product,
                                        as: 'product',
                                        required: false, // Left join để không bị lỗi khi product bị xóa
                                        include: [
                                            {
                                                model: this.ProductImage,
                                                as: 'images',
                                                attributes: ['id', 'imageUrl', 'isPrimary'],
                                                where: { isPrimary: true },
                                                required: false
                                            },
                                            {
                                                model: this.db.Brand,
                                                as: 'brand',
                                                attributes: ['id', 'name'],
                                                required: false
                                            }
                                        ],
                                        attributes: ['id', 'name', 'slug']
                                    }
                                ],
                                attributes: ['id', 'sku', 'color', 'size', 'price', 'originalPrice', 'stockQuantity']
                            }
                        ]
                    }
                ]
            });

            // Ensure items is always an array
            if (cart && !cart.items) {
                cart.items = [];
            }

            return cart;
        } catch (error) {
            throw new Error(`Failed to get cart with items: ${error.message}`);
        }
    }

    // Get cart item by ID
    async getCartItemById(itemId) {
        try {
            const item = await this.CartItem.findByPk(itemId, {
                attributes: ['id', 'cartId', 'productVariantId', 'quantity', 'priceAtAdd', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: this.ProductVariant,
                        as: 'productVariant',
                        required: false,
                        attributes: ['id', 'sku', 'color', 'size', 'price', 'originalPrice', 'stockQuantity'],
                        include: [
                            {
                                model: this.Product,
                                as: 'product',
                                required: false,
                                attributes: ['id', 'name', 'slug'],
                                include: [
                                    {
                                        model: this.ProductImage,
                                        as: 'images',
                                        attributes: ['id', 'imageUrl', 'isPrimary'],
                                        where: { isPrimary: true },
                                        required: false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            return item;
        } catch (error) {
            throw new Error(`Failed to get cart item: ${error.message}`);
        }
    }

    // Check if item already exists in cart
    async findCartItem(cartId, productVariantId) {
        try {
            const item = await this.CartItem.findOne({
                where: {
                    cartId,
                    productVariantId
                },
                attributes: ['id', 'cartId', 'productVariantId', 'quantity', 'priceAtAdd', 'createdAt', 'updatedAt']
            });

            return item;
        } catch (error) {
            throw new Error(`Failed to find cart item: ${error.message}`);
        }
    }

    // Add item to cart
    async addItem(cartId, productVariantId, quantity, priceAtAdd) {
        try {
            // Check if item already exists
            const existingItem = await this.findCartItem(cartId, productVariantId);

            if (existingItem) {
                // Update quantity if item already exists
                existingItem.quantity += quantity;
                await existingItem.save();
                return await this.getCartItemById(existingItem.id);
            }

            // Create new cart item
            const item = await this.CartItem.create({
                cartId,
                productVariantId,
                quantity,
                priceAtAdd
            });

            return await this.getCartItemById(item.id);
        } catch (error) {
            throw new Error(`Failed to add item to cart: ${error.message}`);
        }
    }

    // Update cart item quantity
    async updateItemQuantity(itemId, quantity) {
        try {
            const item = await this.CartItem.findByPk(itemId, {
                attributes: ['id', 'cartId', 'productVariantId', 'quantity', 'priceAtAdd']
            });
            if (!item) {
                throw new Error('Cart item not found');
            }

            item.quantity = quantity;
            await item.save();

            return await this.getCartItemById(itemId);
        } catch (error) {
            throw new Error(`Failed to update cart item: ${error.message}`);
        }
    }

    // Remove item from cart
    async removeItem(itemId) {
        try {
            const deleted = await this.CartItem.destroy({
                where: { id: itemId }
            });

            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to remove cart item: ${error.message}`);
        }
    }

    // Clear cart
    async clearCart(cartId) {
        try {
            const deleted = await this.CartItem.destroy({
                where: { cartId }
            });

            return deleted;
        } catch (error) {
            throw new Error(`Failed to clear cart: ${error.message}`);
        }
    }

    // Calculate cart total
    async calculateCartTotal(cartId) {
        try {
            const cart = await this.getCartWithItems(cartId);
            if (!cart || !cart.items) {
                return {
                    subtotal: 0,
                    totalItems: 0
                };
            }

            let subtotal = 0;
            let totalItems = cart.items.length;

            cart.items.forEach(item => {
                const itemTotal = parseFloat(item.priceAtAdd) * item.quantity;
                subtotal += itemTotal;
            });

            return {
                subtotal: parseFloat(subtotal.toFixed(2)),
                totalItems
            };
        } catch (error) {
            throw new Error(`Failed to calculate cart total: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.Cart.findAll();
    }

    async getById(id) {
        return await this.getCartWithItems(id);
    }

    async getCartOwner(id) {
        try {
            return await this.Cart.findByPk(id, {
                attributes: ['id', 'userId']
            });
        } catch (error) {
            throw new Error(`Failed to get cart owner: ${error.message}`);
        }
    }

    async create(data) {
        return await this.Cart.create(data);
    }

    async update(id, data) {
        await this.Cart.update(data, { where: { id } });
        return await this.getById(id);
    }

    async delete(id) {
        const deleted = await this.Cart.destroy({ where: { id } });
        return deleted > 0;
    }

    async findBy(conditions) {
        return await this.Cart.findAll({ where: conditions });
    }

    async count() {
        return await this.Cart.count();
    }
}

module.exports = CartRepository;


