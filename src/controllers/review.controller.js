const BaseController = require('./base.controller');
const { body, param, query } = require('express-validator');
const container = require('../di-container/di-container');

class ReviewController extends BaseController {
    constructor() {
        super();
        this.reviewService = container.resolve('reviewService');
    }

    // Validation rules
    static createValidationRules() {
        return [
            param('productId').isInt().withMessage('Product ID must be an integer'),
            body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
            body('title').optional().isString(),
            body('comment').optional().isString()
        ];
    }

    static updateValidationRules() {
        return [
            param('reviewId').isInt().withMessage('Review ID must be an integer'),
            body('rating').optional().isInt({ min: 1, max: 5 }),
            body('title').optional().isString(),
            body('comment').optional().isString()
        ];
    }

    // Get product reviews
    async getProductReviews(req, res) {
        try {
            const { productId } = req.params;
            const {
                page = 1,
                limit = 20,
                orderBy = 'createdAt',
                orderDirection = 'DESC',
                rating
            } = req.query;

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                orderBy,
                orderDirection,
                rating
            };

            const result = await this.reviewService.getProductReviews(parseInt(productId), options);
            
            return this.success(res, {
                reviews: result.reviews.map(r => r.toJSON()),
                pagination: result.pagination,
                averageRating: result.averageRating
            }, 'Reviews retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Create review
    async createReview(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            const reviewData = req.body;
            const review = await this.reviewService.createReview(userId, parseInt(productId), reviewData);
            return this.success(res, review.toJSON(), 'Review created successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Update review
    async updateReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            const reviewData = req.body;
            const review = await this.reviewService.updateReview(parseInt(reviewId), userId, reviewData);
            return this.success(res, review.toJSON(), 'Review updated successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Delete review
    async deleteReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            await this.reviewService.deleteReview(parseInt(reviewId), userId);
            return this.success(res, null, 'Review deleted successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get user's review for product
    async getUserReview(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            const review = await this.reviewService.getUserReview(userId, parseInt(productId));
            if (!review) {
                return this.success(res, null, 'No review found');
            }
            return this.success(res, review.toJSON(), 'Review retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = ReviewController;

