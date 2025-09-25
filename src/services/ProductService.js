const slugify = require('slugify');
const ServiceInterface = require('../interfaces/service.interface');

class ProductService extends ServiceInterface {
    constructor(productRepository, categoryRepository, brandRepository) {
        super();
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    // Implement ServiceInterface methods
    async getAll() {
        return await this.productRepository.findAll();
    }

    async getById(id) {
        return await this.productRepository.findById(id);
    }

    async create(data) {
        return await this.createProduct(data);
    }

    async update(id, data) {
        return await this.updateProduct(id, data);
    }

    async delete(id) {
        return await this.deleteProduct(id);
    }

    async validate(data) {
        // Basic validation - can be extended
        const errors = [];
        
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Product name is required');
        }
        
        if (data.name && data.name.length > 255) {
            errors.push('Product name must be less than 255 characters');
        }

        if (data.description && data.description.length > 2000) {
            errors.push('Product description must be less than 2000 characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Create a new product
    async createProduct(productData) {
        try {
            // Generate slug if not provided
            if (!productData.slug && productData.name) {
                productData.slug = await this.generateUniqueSlug(productData.name);
            }

            // Validate brand exists if provided
            if (productData.brandId) {
                const brand = await this.brandRepository.findById(productData.brandId);
                if (!brand) {
                    throw new Error('Brand not found');
                }
            }

            // Validate categories exist if provided
            if (productData.categoryIds && productData.categoryIds.length > 0) {
                await this.validateCategories(productData.categoryIds);
            }

            const product = await this.productRepository.create(productData);

            // Associate categories if provided
            if (productData.categoryIds && productData.categoryIds.length > 0) {
                await product.setCategories(productData.categoryIds);
            }

            return await this.productRepository.findById(product.id);
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    // Get product by ID
    async getProductById(id) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Failed to get product: ${error.message}`);
        }
    }

    // Get product by slug
    async getProductBySlug(slug) {
        try {
            const product = await this.productRepository.findBySlug(slug);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Failed to get product: ${error.message}`);
        }
    }

    // Get all products with filtering
    async getProducts(options = {}) {
        try {
            return await this.productRepository.findAll(options);
        } catch (error) {
            throw new Error(`Failed to get products: ${error.message}`);
        }
    }

    // Update product
    async updateProduct(id, updateData) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            // Generate new slug if name is being updated
            if (updateData.name && updateData.name !== product.name) {
                if (!updateData.slug) {
                    updateData.slug = await this.generateUniqueSlug(updateData.name, id);
                }
            }

            // Validate brand exists if being updated
            if (updateData.brandId) {
                const brand = await this.brandRepository.findById(updateData.brandId);
                if (!brand) {
                    throw new Error('Brand not found');
                }
            }

            // Validate categories exist if being updated
            if (updateData.categoryIds && updateData.categoryIds.length > 0) {
                await this.validateCategories(updateData.categoryIds);
            }

            const updatedProduct = await this.productRepository.update(id, updateData);

            // Update categories if provided
            if (updateData.categoryIds !== undefined) {
                await updatedProduct.setCategories(updateData.categoryIds);
            }

            return await this.productRepository.findById(id);
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    // Delete product
    async deleteProduct(id) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if product has orders (soft delete logic)
            // You might want to implement soft delete instead of hard delete
            const hasOrders = product.orderItems && product.orderItems.length > 0;
            if (hasOrders) {
                // Instead of deleting, mark as inactive
                return await this.productRepository.update(id, { isActive: false });
            }

            return await this.productRepository.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    // Get featured products
    async getFeaturedProducts(limit = 10) {
        try {
            return await this.productRepository.findFeatured(limit);
        } catch (error) {
            throw new Error(`Failed to get featured products: ${error.message}`);
        }
    }

    // Get hot products
    async getHotProducts(limit = 10) {
        try {
            return await this.productRepository.findHot(limit);
        } catch (error) {
            throw new Error(`Failed to get hot products: ${error.message}`);
        }
    }

    // Get new products
    async getNewProducts(limit = 10) {
        try {
            return await this.productRepository.findNew(limit);
        } catch (error) {
            throw new Error(`Failed to get new products: ${error.message}`);
        }
    }

    // Get products by category
    async getProductsByCategory(categoryId, options = {}) {
        try {
            const category = await this.categoryRepository.findById(categoryId);
            if (!category) {
                throw new Error('Category not found');
            }

            return await this.productRepository.findByCategory(categoryId, options);
        } catch (error) {
            throw new Error(`Failed to get products by category: ${error.message}`);
        }
    }

    // Get products by brand
    async getProductsByBrand(brandId, options = {}) {
        try {
            const brand = await this.brandRepository.findById(brandId);
            if (!brand) {
                throw new Error('Brand not found');
            }

            return await this.productRepository.findByBrand(brandId, options);
        } catch (error) {
            throw new Error(`Failed to get products by brand: ${error.message}`);
        }
    }

    // Search products
    async searchProducts(searchTerm, options = {}) {
        try {
            const searchOptions = {
                ...options,
                search: searchTerm
            };
            return await this.productRepository.findAll(searchOptions);
        } catch (error) {
            throw new Error(`Failed to search products: ${error.message}`);
        }
    }

    // Generate unique slug
    async generateUniqueSlug(name, excludeId = null) {
        let baseSlug = slugify(name, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await this.productRepository.slugExists(slug, excludeId)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    // Validate categories exist
    async validateCategories(categoryIds) {
        try {
            for (const categoryId of categoryIds) {
                const category = await this.categoryRepository.findById(categoryId);
                if (!category) {
                    throw new Error(`Category with ID ${categoryId} not found`);
                }
                if (!category.isActive) {
                    throw new Error(`Category with ID ${categoryId} is inactive`);
                }
            }
        } catch (error) {
            throw new Error(`Category validation failed: ${error.message}`);
        }
    }

    // Toggle product status
    async toggleProductStatus(id, status) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            return await this.productRepository.update(id, { isActive: status });
        } catch (error) {
            throw new Error(`Failed to toggle product status: ${error.message}`);
        }
    }

    // Toggle featured status
    async toggleFeaturedStatus(id, isFeatured) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            return await this.productRepository.update(id, { isFeatured });
        } catch (error) {
            throw new Error(`Failed to toggle featured status: ${error.message}`);
        }
    }

    // Toggle hot status
    async toggleHotStatus(id, isHot) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            return await this.productRepository.update(id, { isHot });
        } catch (error) {
            throw new Error(`Failed to toggle hot status: ${error.message}`);
        }
    }

    // Toggle new status
    async toggleNewStatus(id, isNew) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            return await this.productRepository.update(id, { isNew });
        } catch (error) {
            throw new Error(`Failed to toggle new status: ${error.message}`);
        }
    }

    // Get product statistics
    async getProductStats() {
        try {
            const db = this.productRepository.db;
            const stats = await db.Product.findAll({
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalProducts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "isActive" = true THEN 1 END')), 'activeProducts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "isFeatured" = true THEN 1 END')), 'featuredProducts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "isHot" = true THEN 1 END')), 'hotProducts'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "isNew" = true THEN 1 END')), 'newProducts']
                ],
                raw: true
            });

            return stats[0] || {
                totalProducts: 0,
                activeProducts: 0,
                featuredProducts: 0,
                hotProducts: 0,
                newProducts: 0
            };
        } catch (error) {
            throw new Error(`Failed to get product statistics: ${error.message}`);
        }
    }
}

module.exports = ProductService;
