const ServiceInterface = require('../interfaces/service.interface');

class WishlistService extends ServiceInterface {
    constructor(wishlistRepository, productRepository) {
        super();
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    // Get user's wishlist
    async getWishlist(userId) {
        try {
            const wishlist = await this.wishlistRepository.getOrCreateDefaultWishlist(userId);
            const wishlistWithItems = await this.wishlistRepository.getWishlistWithItems(wishlist.id);
            
            return {
                wishlist: wishlistWithItems.toJSON(),
                itemCount: wishlistWithItems.items?.length || 0
            };
        } catch (error) {
            throw new Error(`Failed to get wishlist: ${error.message}`);
        }
    }

    // Add product to wishlist
    async addProduct(userId, productId) {
        try {
            // Validate product exists
            const product = await this.productRepository.getById(productId);
            if (!product || !product.isActive) {
                throw new Error('Product not found or inactive');
            }

            // Get or create wishlist
            const wishlist = await this.wishlistRepository.getOrCreateDefaultWishlist(userId);

            // Add product
            const item = await this.wishlistRepository.addProduct(wishlist.id, productId);

            // Get updated wishlist
            const updatedWishlist = await this.wishlistRepository.getWishlistWithItems(wishlist.id);

            return {
                item: item.toJSON(),
                wishlist: updatedWishlist.toJSON()
            };
        } catch (error) {
            throw error;
        }
    }

    // Remove product from wishlist
    async removeProduct(userId, productId) {
        try {
            const wishlist = await this.wishlistRepository.getOrCreateDefaultWishlist(userId);
            const removed = await this.wishlistRepository.removeProduct(wishlist.id, productId);

            if (!removed) {
                throw new Error('Product not found in wishlist');
            }

            // Get updated wishlist
            const updatedWishlist = await this.wishlistRepository.getWishlistWithItems(wishlist.id);

            return {
                wishlist: updatedWishlist.toJSON()
            };
        } catch (error) {
            throw error;
        }
    }

    // Remove wishlist item by ID
    async removeItem(userId, itemId) {
        try {
            const item = await this.wishlistRepository.db.WishlistItem.findByPk(itemId);
            if (!item) {
                throw new Error('Wishlist item not found');
            }

            // Verify wishlist belongs to user
            const wishlist = await this.wishlistRepository.db.Wishlist.findByPk(item.wishlistId);
            if (wishlist.userId !== userId) {
                throw new Error('Unauthorized');
            }

            await this.wishlistRepository.removeItem(itemId);

            // Get updated wishlist
            const updatedWishlist = await this.wishlistRepository.getWishlistWithItems(item.wishlistId);

            return {
                wishlist: updatedWishlist.toJSON()
            };
        } catch (error) {
            throw error;
        }
    }

    // Check if product is in wishlist
    async isProductInWishlist(userId, productId) {
        try {
            const wishlist = await this.wishlistRepository.getOrCreateDefaultWishlist(userId);
            const item = await this.wishlistRepository.findWishlistItem(wishlist.id, productId);
            return !!item;
        } catch (error) {
            return false;
        }
    }

    // Get all user wishlists
    async getUserWishlists(userId) {
        try {
            const wishlists = await this.wishlistRepository.getUserWishlists(userId);
            return {
                wishlists: wishlists.map(w => w.toJSON())
            };
        } catch (error) {
            throw new Error(`Failed to get user wishlists: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.wishlistRepository.getAll();
    }

    async getById(id) {
        return await this.wishlistRepository.getById(id);
    }

    async create(data) {
        return await this.wishlistRepository.create(data);
    }

    async update(id, data) {
        return await this.wishlistRepository.update(id, data);
    }

    async delete(id) {
        return await this.wishlistRepository.delete(id);
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

module.exports = WishlistService;

