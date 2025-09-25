const BaseController = require('./base.controller');
const { body, query, param } = require('express-validator');
const container = require('../di-container/di-container');

class ProductController extends BaseController {
    constructor() {
        super();
        this.productService = container.resolve('productService');
    }

    // Validation rules
    static createValidationRules() {
        return [
            body('name').notEmpty().withMessage('Product name is required'),
            body('description').optional().isString(),
            body('shortDescription').optional().isString(),
            body('brandId').optional().isInt().withMessage('Brand ID must be an integer'),
            body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
            body('categoryIds.*').optional().isInt().withMessage('Each category ID must be an integer'),
            body('isActive').optional().isBoolean(),
            body('isFeatured').optional().isBoolean(),
            body('isHot').optional().isBoolean(),
            body('isNew').optional().isBoolean(),
            body('metaTitle').optional().isString(),
            body('metaDescription').optional().isString()
        ];
    }

    static updateValidationRules() {
        return [
            param('id').isInt().withMessage('Product ID must be an integer'),
            body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
            body('description').optional().isString(),
            body('shortDescription').optional().isString(),
            body('brandId').optional().isInt().withMessage('Brand ID must be an integer'),
            body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
            body('categoryIds.*').optional().isInt().withMessage('Each category ID must be an integer'),
            body('isActive').optional().isBoolean(),
            body('isFeatured').optional().isBoolean(),
            body('isHot').optional().isBoolean(),
            body('isNew').optional().isBoolean(),
            body('metaTitle').optional().isString(),
            body('metaDescription').optional().isString()
        ];
    }

    static queryValidationRules() {
        return [
            query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
            query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
            query('categoryId').optional().isInt().withMessage('Category ID must be an integer'),
            query('brandId').optional().isInt().withMessage('Brand ID must be an integer'),
            query('isActive').optional().isBoolean(),
            query('isFeatured').optional().isBoolean(),
            query('isHot').optional().isBoolean(),
            query('isNew').optional().isBoolean(),
            query('search').optional().isString(),
            query('sortBy').optional().isIn(['name', 'createdAt', 'updatedAt']).withMessage('Invalid sort field'),
            query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
        ];
    }

    // Create product
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const product = await this.productService.createProduct(productData);
            
            return this.success(res, product, 'Product created successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to create product', 400);
        }
    }

    // Get all products
    async getProducts(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                categoryId: req.query.categoryId,
                brandId: req.query.brandId,
                isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
                isFeatured: req.query.isFeatured !== undefined ? req.query.isFeatured === 'true' : undefined,
                isHot: req.query.isHot !== undefined ? req.query.isHot === 'true' : undefined,
                isNew: req.query.isNew !== undefined ? req.query.isNew === 'true' : undefined,
                search: req.query.search,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC'
            };

            const result = await this.productService.getProducts(options);
            
            return this.success(res, result, 'Products retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get products', 500);
        }
    }

    // Get product by ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            
            return this.success(res, product, 'Product retrieved successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to get product', status);
        }
    }

    // Get product by slug
    async getProductBySlug(req, res) {
        try {
            const { slug } = req.params;
            const product = await this.productService.getProductBySlug(slug);
            
            return this.success(res, product, 'Product retrieved successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to get product', status);
        }
    }

    // Update product
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const product = await this.productService.updateProduct(id, updateData);
            
            return this.success(res, product, 'Product updated successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 400;
            return this.error(res, error.message, 'Failed to update product', status);
        }
    }

    // Delete product
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            
            return this.success(res, {}, 'Product deleted successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to delete product', status);
        }
    }

    // Get featured products
    async getFeaturedProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const products = await this.productService.getFeaturedProducts(limit);
            
            return this.success(res, products, 'Featured products retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get featured products', 500);
        }
    }

    // Get hot products
    async getHotProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const products = await this.productService.getHotProducts(limit);
            
            return this.success(res, products, 'Hot products retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get hot products', 500);
        }
    }

    // Get new products
    async getNewProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const products = await this.productService.getNewProducts(limit);
            
            return this.success(res, products, 'New products retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get new products', 500);
        }
    }

    // Get products by category
    async getProductsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                brandId: req.query.brandId,
                isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC'
            };

            const result = await this.productService.getProductsByCategory(categoryId, options);
            
            return this.success(res, result, 'Products by category retrieved successfully');
        } catch (error) {
            const status = error.message === 'Category not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to get products by category', status);
        }
    }

    // Get products by brand
    async getProductsByBrand(req, res) {
        try {
            const { brandId } = req.params;
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                categoryId: req.query.categoryId,
                isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC'
            };

            const result = await this.productService.getProductsByBrand(brandId, options);
            
            return this.success(res, result, 'Products by brand retrieved successfully');
        } catch (error) {
            const status = error.message === 'Brand not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to get products by brand', status);
        }
    }

    // Search products
    async searchProducts(req, res) {
        try {
            const { q } = req.query;
            if (!q) {
                return this.error(res, 'Search query is required', 'Bad request', 400);
            }

            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                categoryId: req.query.categoryId,
                brandId: req.query.brandId,
                isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC'
            };

            const result = await this.productService.searchProducts(q, options);
            
            return this.success(res, result, 'Search results retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to search products', 500);
        }
    }

    // Toggle product status
    async toggleProductStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            
            if (typeof isActive !== 'boolean') {
                return this.error(res, 'isActive must be a boolean', 'Bad request', 400);
            }

            const product = await this.productService.toggleProductStatus(id, isActive);
            
            return this.success(res, product, 'Product status updated successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to update product status', status);
        }
    }

    // Toggle featured status
    async toggleFeaturedStatus(req, res) {
        try {
            const { id } = req.params;
            const { isFeatured } = req.body;
            
            if (typeof isFeatured !== 'boolean') {
                return this.error(res, 'isFeatured must be a boolean', 'Bad request', 400);
            }

            const product = await this.productService.toggleFeaturedStatus(id, isFeatured);
            
            return this.success(res, product, 'Featured status updated successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to update featured status', status);
        }
    }

    // Toggle hot status
    async toggleHotStatus(req, res) {
        try {
            const { id } = req.params;
            const { isHot } = req.body;
            
            if (typeof isHot !== 'boolean') {
                return this.error(res, 'isHot must be a boolean', 'Bad request', 400);
            }

            const product = await this.productService.toggleHotStatus(id, isHot);
            
            return this.success(res, product, 'Hot status updated successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to update hot status', status);
        }
    }

    // Toggle new status
    async toggleNewStatus(req, res) {
        try {
            const { id } = req.params;
            const { isNew } = req.body;
            
            if (typeof isNew !== 'boolean') {
                return this.error(res, 'isNew must be a boolean', 'Bad request', 400);
            }

            const product = await this.productService.toggleNewStatus(id, isNew);
            
            return this.success(res, product, 'New status updated successfully');
        } catch (error) {
            const status = error.message === 'Product not found' ? 404 : 500;
            return this.error(res, error.message, 'Failed to update new status', status);
        }
    }

    // Get product statistics
    async getProductStats(req, res) {
        try {
            const stats = await this.productService.getProductStats();
            
            return this.success(res, stats, 'Product statistics retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get product statistics', 500);
        }
    }
}

module.exports = ProductController;
