const RepositoryInterface = require('../interfaces/repository.interface');

class WishlistRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Wishlist = db.Wishlist;
        this.WishlistItem = db.WishlistItem;
        this.Product = db.Product;
        this.ProductImage = db.ProductImage;
        this.ProductVariant = db.ProductVariant;
        this.model = db.Wishlist;
    }

    // Get or create default wishlist for user
    async getOrCreateDefaultWishlist(userId) {
        try {
            let wishlist = await this.Wishlist.findOne({
                where: {
                    userId,
                    isDefault: true
                }
            });

            if (!wishlist) {
                wishlist = await this.Wishlist.create({
                    userId,
                    name: 'My Wishlist',
                    isDefault: true
                });
            }

            return wishlist;
        } catch (error) {
            throw new Error(`Failed to get or create wishlist: ${error.message}`);
        }
    }

    // Get wishlist with items
    async getWishlistWithItems(wishlistId) {
        try {
            const wishlist = await this.Wishlist.findByPk(wishlistId, {
                include: [
                    {
                        model: this.WishlistItem,
                        as: 'items',
                        include: [
                            {
                                model: this.Product,
                                as: 'product',
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
                                        attributes: ['id', 'name']
                                    },
                                    {
                                        model: this.ProductVariant,
                                        as: 'variants',
                                        attributes: ['id', 'sku', 'color', 'size', 'price', 'originalPrice', 'stockQuantity', 'isActive'],
                                        where: { isActive: true },
                                        required: false
                                    }
                                ],
                                attributes: ['id', 'name', 'slug', 'isActive']
                            }
                        ]
                    }
                ]
            });

            return wishlist;
        } catch (error) {
            throw new Error(`Failed to get wishlist with items: ${error.message}`);
        }
    }

    // Check if product already in wishlist
    async findWishlistItem(wishlistId, productId) {
        try {
            const item = await this.WishlistItem.findOne({
                where: {
                    wishlistId,
                    productId
                }
            });

            return item;
        } catch (error) {
            throw new Error(`Failed to find wishlist item: ${error.message}`);
        }
    }

    // Add product to wishlist
    async addProduct(wishlistId, productId) {
        try {
            // Check if already exists
            const existingItem = await this.findWishlistItem(wishlistId, productId);
            if (existingItem) {
                return existingItem;
            }

            // Create new wishlist item
            const item = await this.WishlistItem.create({
                wishlistId,
                productId
            });

            return item;
        } catch (error) {
            throw new Error(`Failed to add product to wishlist: ${error.message}`);
        }
    }

    // Remove product from wishlist
    async removeProduct(wishlistId, productId) {
        try {
            const deleted = await this.WishlistItem.destroy({
                where: {
                    wishlistId,
                    productId
                }
            });

            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to remove product from wishlist: ${error.message}`);
        }
    }

    // Remove wishlist item by ID
    async removeItem(itemId) {
        try {
            const deleted = await this.WishlistItem.destroy({
                where: { id: itemId }
            });

            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to remove wishlist item: ${error.message}`);
        }
    }

    // Get all wishlists for user
    async getUserWishlists(userId) {
        try {
            const wishlists = await this.Wishlist.findAll({
                where: { userId },
                include: [
                    {
                        model: this.WishlistItem,
                        as: 'items',
                        attributes: ['id', 'productId']
                    }
                ],
                order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
            });

            return wishlists;
        } catch (error) {
            throw new Error(`Failed to get user wishlists: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.Wishlist.findAll();
    }

    async getById(id) {
        return await this.getWishlistWithItems(id);
    }

    async create(data) {
        return await this.Wishlist.create(data);
    }

    async update(id, data) {
        await this.Wishlist.update(data, { where: { id } });
        return await this.getById(id);
    }

    async delete(id) {
        const deleted = await this.Wishlist.destroy({ where: { id } });
        return deleted > 0;
    }

    async findBy(conditions) {
        return await this.Wishlist.findAll({ where: conditions });
    }

    async count() {
        return await this.Wishlist.count();
    }
}

module.exports = WishlistRepository;


