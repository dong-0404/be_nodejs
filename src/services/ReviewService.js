const ServiceInterface = require('../interfaces/service.interface');

class ReviewService extends ServiceInterface {
    constructor(reviewRepository, productRepository) {
        super();
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    // Get product reviews
    async getProductReviews(productId, options = {}) {
        try {
            // Verify product exists
            const product = await this.productRepository.getById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            return await this.reviewRepository.getProductReviews(productId, options);
        } catch (error) {
            throw error;
        }
    }

    // Create review
    async createReview(userId, productId, reviewData) {
        try {
            // Verify product exists
            const product = await this.productRepository.getById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if user has already reviewed
            const hasReviewed = await this.reviewRepository.hasUserReviewed(userId, productId);
            if (hasReviewed) {
                throw new Error('You have already reviewed this product');
            }

            // Validate rating
            const { rating, title, comment } = reviewData;
            if (!rating || rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }

            // Create review
            const review = await this.reviewRepository.create({
                userId,
                productId,
                rating,
                title,
                comment,
                isApproved: true
            });

            return await this.reviewRepository.getById(review.id);
        } catch (error) {
            throw error;
        }
    }

    // Update review
    async updateReview(reviewId, userId, reviewData) {
        try {
            // Verify ownership
            const review = await this.reviewRepository.getById(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }
            if (review.userId !== userId) {
                throw new Error('Unauthorized');
            }

            // Validate rating if provided
            if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
                throw new Error('Rating must be between 1 and 5');
            }

            // Update review
            return await this.reviewRepository.update(reviewId, reviewData);
        } catch (error) {
            throw error;
        }
    }

    // Delete review
    async deleteReview(reviewId, userId) {
        try {
            // Verify ownership
            const review = await this.reviewRepository.getById(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }
            if (review.userId !== userId) {
                throw new Error('Unauthorized');
            }

            return await this.reviewRepository.delete(reviewId);
        } catch (error) {
            throw error;
        }
    }

    // Get user's review for product
    async getUserReview(userId, productId) {
        try {
            return await this.reviewRepository.getUserReview(userId, productId);
        } catch (error) {
            throw new Error(`Failed to get user review: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.reviewRepository.getAll();
    }

    async getById(id) {
        return await this.reviewRepository.getById(id);
    }

    async create(data) {
        return await this.reviewRepository.create(data);
    }

    async update(id, data) {
        return await this.reviewRepository.update(id, data);
    }

    async delete(id) {
        return await this.reviewRepository.delete(id);
    }

    async validate(data) {
        const errors = [];
        if (!data.rating) errors.push('Rating is required');
        if (data.rating && (data.rating < 1 || data.rating > 5)) {
            errors.push('Rating must be between 1 and 5');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = ReviewService;

