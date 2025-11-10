const RepositoryInterface = require('../interfaces/repository.interface');

class ReviewRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Review = db.Review;
        this.Product = db.Product;
        this.User = db.User;
        this.model = db.Review;
    }

    // Get reviews by product ID
    async getProductReviews(productId, options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                orderBy = 'createdAt',
                orderDirection = 'DESC',
                rating = null
            } = options;

            const where = { productId, isApproved: true };
            if (rating) {
                where.rating = parseInt(rating);
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await this.Review.findAndCountAll({
                where,
                include: [
                    {
                        model: this.User,
                        as: 'user',
                        attributes: ['id', 'full_name', 'email']
                    }
                ],
                order: [[orderBy, orderDirection]],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            // Calculate average rating
            const avgRating = await this.getAverageRating(productId);

            return {
                reviews: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                },
                averageRating: avgRating
            };
        } catch (error) {
            throw new Error(`Failed to get product reviews: ${error.message}`);
        }
    }

    // Get average rating for product
    async getAverageRating(productId) {
        try {
            const result = await this.Review.findOne({
                where: { productId, isApproved: true },
                attributes: [
                    [this.db.sequelize.fn('AVG', this.db.sequelize.col('rating')), 'avgRating'],
                    [this.db.sequelize.fn('COUNT', this.db.sequelize.col('id')), 'totalReviews']
                ],
                raw: true
            });

            return {
                average: parseFloat(result?.avgRating || 0).toFixed(1),
                total: parseInt(result?.totalReviews || 0)
            };
        } catch (error) {
            throw new Error(`Failed to get average rating: ${error.message}`);
        }
    }

    // Check if user has already reviewed product
    async hasUserReviewed(userId, productId) {
        try {
            const review = await this.Review.findOne({
                where: { userId, productId }
            });
            return !!review;
        } catch (error) {
            throw new Error(`Failed to check user review: ${error.message}`);
        }
    }

    // Get user's review for product
    async getUserReview(userId, productId) {
        try {
            return await this.Review.findOne({
                where: { userId, productId },
                include: [
                    {
                        model: this.User,
                        as: 'user',
                        attributes: ['id', 'full_name', 'email']
                    }
                ]
            });
        } catch (error) {
            throw new Error(`Failed to get user review: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.Review.findAll({
            include: [
                {
                    model: this.Product,
                    as: 'product',
                    attributes: ['id', 'name']
                },
                {
                    model: this.User,
                    as: 'user',
                    attributes: ['id', 'full_name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async getById(id) {
        return await this.Review.findByPk(id, {
            include: [
                {
                    model: this.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: this.User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });
    }

    async create(data) {
        return await this.Review.create(data);
    }

    async update(id, data) {
        await this.Review.update(data, { where: { id } });
        return await this.getById(id);
    }

    async delete(id) {
        const deleted = await this.Review.destroy({ where: { id } });
        return deleted > 0;
    }

    async findBy(conditions) {
        return await this.Review.findAll({ where: conditions });
    }

    async count() {
        return await this.Review.count();
    }
}

module.exports = ReviewRepository;

