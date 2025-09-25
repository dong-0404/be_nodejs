const { Op } = require('sequelize');
const RepositoryInterface = require('../interfaces/repository.interface');

class ProductRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Product = db.Product;
        this.Category = db.Category;
        this.Brand = db.Brand;
        this.ProductImage = db.ProductImage;
        this.ProductVariant = db.ProductVariant;
        this.Review = db.Review;
        this.model = db.Product; // For interface compatibility
    }

    // Implement RepositoryInterface methods
    async getAll() {
        return await this.findAll();
    }

    async getById(id) {
        return await this.findById(id);
    }

    async getBySlug(slug) {
        return await this.findBySlug(slug);
    }

    async count() {
        return await this.Product.count();
    }

    // Create a new product
    async create(productData) {
        try {
            const product = await this.Product.create(productData);
            return await this.findById(product.id);
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    // Find product by ID with all related data
    async findById(id) {
        try {
            const product = await this.Product.findByPk(id, {
                include: [
                    {
                        model: this.Brand,
                        as: 'brand',
                        attributes: ['id', 'name', 'slug', 'logoUrl']
                    },
                    {
                        model: this.Category,
                        as: 'categories',
                        attributes: ['id', 'name', 'slug'],
                        through: { attributes: [] }
                    },
                    {
                        model: this.ProductImage,
                        as: 'images',
                        attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary']
                    },
                    {
                        model: this.ProductVariant,
                        as: 'variants',
                        attributes: ['id', 'name', 'sku', 'price', 'comparePrice', 'costPrice', 'stock', 'weight', 'dimensions', 'attributes']
                    },
                    {
                        model: this.Review,
                        as: 'reviews',
                        attributes: ['id', 'rating', 'title', 'comment', 'createdAt'],
                        include: [
                            {
                                model: this.db.User,
                                attributes: ['id', 'firstName', 'lastName']
                            }
                        ]
                    }
                ],
                order: [
                    [{ model: this.ProductImage, as: 'images' }, 'sortOrder', 'ASC'],
                    [{ model: this.ProductVariant, as: 'variants' }, 'id', 'ASC'],
                    [{ model: this.Review, as: 'reviews' }, 'createdAt', 'DESC']
                ]
            });
            return product;
        } catch (error) {
            throw new Error(`Failed to find product: ${error.message}`);
        }
    }

    // Find product by slug
    async findBySlug(slug) {
        try {
            const product = await this.Product.findOne({
                where: { slug },
                include: [
                    {
                        model: this.Brand,
                        as: 'brand',
                        attributes: ['id', 'name', 'slug', 'logoUrl']
                    },
                    {
                        model: this.Category,
                        as: 'categories',
                        attributes: ['id', 'name', 'slug'],
                        through: { attributes: [] }
                    },
                    {
                        model: this.ProductImage,
                        as: 'images',
                        attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary']
                    },
                    {
                        model: this.ProductVariant,
                        as: 'variants',
                        attributes: ['id', 'name', 'sku', 'price', 'comparePrice', 'costPrice', 'stock', 'weight', 'dimensions', 'attributes']
                    },
                    {
                        model: this.Review,
                        as: 'reviews',
                        attributes: ['id', 'rating', 'title', 'comment', 'createdAt'],
                        include: [
                            {
                                model: this.db.User,
                                attributes: ['id', 'firstName', 'lastName']
                            }
                        ]
                    }
                ],
                order: [
                    [{ model: this.ProductImage, as: 'images' }, 'sortOrder', 'ASC'],
                    [{ model: this.ProductVariant, as: 'variants' }, 'id', 'ASC'],
                    [{ model: this.Review, as: 'reviews' }, 'createdAt', 'DESC']
                ]
            });
            return product;
        } catch (error) {
            throw new Error(`Failed to find product by slug: ${error.message}`);
        }
    }

    // Get all products with pagination and filtering
    async findAll(options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                categoryId,
                brandId,
                isActive = true,
                isFeatured,
                isHot,
                isNew,
                search,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = options;

            const offset = (page - 1) * limit;
            const where = {};

            // Apply filters
            if (isActive !== undefined) where.isActive = isActive;
            if (isFeatured !== undefined) where.isFeatured = isFeatured;
            if (isHot !== undefined) where.isHot = isHot;
            if (isNew !== undefined) where.isNew = isNew;
            if (brandId) where.brandId = brandId;

            // Search functionality
            if (search) {
                where[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                    { shortDescription: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const include = [
                {
                    model: this.Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug', 'logoUrl']
                },
                {
                    model: this.Category,
                    as: 'categories',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] },
                    ...(categoryId ? [{ where: { id: categoryId } }] : [])
                },
                {
                    model: this.ProductImage,
                    as: 'images',
                    attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary'],
                    where: { isPrimary: true },
                    required: false
                }
            ];

            const { count, rows } = await this.Product.findAndCountAll({
                where,
                include,
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true
            });

            return {
                products: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Failed to find products: ${error.message}`);
        }
    }

    // Update product
    async update(id, updateData) {
        try {
            await this.Product.update(updateData, { where: { id } });
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    // Delete product
    async delete(id) {
        try {
            const deleted = await this.Product.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    // Get featured products
    async findFeatured(limit = 10) {
        try {
            const products = await this.Product.findAll({
                where: { isFeatured: true, isActive: true },
                include: [
                    {
                        model: this.Brand,
                        as: 'brand',
                        attributes: ['id', 'name', 'slug', 'logoUrl']
                    },
                    {
                        model: this.Category,
                        as: 'categories',
                        attributes: ['id', 'name', 'slug'],
                        through: { attributes: [] }
                    },
                    {
                        model: this.ProductImage,
                        as: 'images',
                        attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary'],
                        where: { isPrimary: true },
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit
            });
            return products;
        } catch (error) {
            throw new Error(`Failed to find featured products: ${error.message}`);
        }
    }

    // Get hot products
    async findHot(limit = 10) {
        try {
            const products = await this.Product.findAll({
                where: { isHot: true, isActive: true },
                include: [
                    {
                        model: this.Brand,
                        as: 'brand',
                        attributes: ['id', 'name', 'slug', 'logoUrl']
                    },
                    {
                        model: this.Category,
                        as: 'categories',
                        attributes: ['id', 'name', 'slug'],
                        through: { attributes: [] }
                    },
                    {
                        model: this.ProductImage,
                        as: 'images',
                        attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary'],
                        where: { isPrimary: true },
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit
            });
            return products;
        } catch (error) {
            throw new Error(`Failed to find hot products: ${error.message}`);
        }
    }

    // Get new products
    async findNew(limit = 10) {
        try {
            const products = await this.Product.findAll({
                where: { isNew: true, isActive: true },
                include: [
                    {
                        model: this.Brand,
                        as: 'brand',
                        attributes: ['id', 'name', 'slug', 'logoUrl']
                    },
                    {
                        model: this.Category,
                        as: 'categories',
                        attributes: ['id', 'name', 'slug'],
                        through: { attributes: [] }
                    },
                    {
                        model: this.ProductImage,
                        as: 'images',
                        attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary'],
                        where: { isPrimary: true },
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit
            });
            return products;
        } catch (error) {
            throw new Error(`Failed to find new products: ${error.message}`);
        }
    }

    // Check if slug exists
    async slugExists(slug, excludeId = null) {
        try {
            const where = { slug };
            if (excludeId) {
                where.id = { [Op.ne]: excludeId };
            }
            const product = await this.Product.findOne({ where });
            return !!product;
        } catch (error) {
            throw new Error(`Failed to check slug existence: ${error.message}`);
        }
    }

    // Get products by category
    async findByCategory(categoryId, options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                brandId,
                isActive = true,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = options;

            const offset = (page - 1) * limit;
            const where = { isActive };

            if (brandId) where.brandId = brandId;

            const include = [
                {
                    model: this.Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug', 'logoUrl']
                },
                {
                    model: this.Category,
                    as: 'categories',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] },
                    where: { id: categoryId }
                },
                {
                    model: this.ProductImage,
                    as: 'images',
                    attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary'],
                    where: { isPrimary: true },
                    required: false
                }
            ];

            const { count, rows } = await this.Product.findAndCountAll({
                where,
                include,
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true
            });

            return {
                products: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Failed to find products by category: ${error.message}`);
        }
    }

    // Get products by brand
    async findByBrand(brandId, options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                categoryId,
                isActive = true,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = options;

            const offset = (page - 1) * limit;
            const where = { brandId, isActive };

            const include = [
                {
                    model: this.Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug', 'logoUrl']
                },
                {
                    model: this.Category,
                    as: 'categories',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] },
                    ...(categoryId ? [{ where: { id: categoryId } }] : [])
                },
                {
                    model: this.ProductImage,
                    as: 'images',
                    attributes: ['id', 'imageUrl', 'altText', 'sortOrder', 'isPrimary'],
                    where: { isPrimary: true },
                    required: false
                }
            ];

            const { count, rows } = await this.Product.findAndCountAll({
                where,
                include,
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true
            });

            return {
                products: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Failed to find products by brand: ${error.message}`);
        }
    }
}

module.exports = ProductRepository;
