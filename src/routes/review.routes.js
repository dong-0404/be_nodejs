const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');

const reviewController = new ReviewController();

// Public routes (no auth required)
router.get('/products/:productId/reviews',
    reviewController.getProductReviews
);

// Authenticated routes
router.get('/products/:productId/reviews/my',
    authMiddleware.authenticate,
    reviewController.getUserReview
);

router.post('/products/:productId/reviews',
    authMiddleware.authenticate,
    ReviewController.createValidationRules(),
    reviewController.validate,
    reviewController.createReview
);

router.put('/reviews/:reviewId',
    authMiddleware.authenticate,
    ReviewController.updateValidationRules(),
    reviewController.validate,
    reviewController.updateReview
);

router.delete('/reviews/:reviewId',
    authMiddleware.authenticate,
    reviewController.deleteReview
);

module.exports = router;

