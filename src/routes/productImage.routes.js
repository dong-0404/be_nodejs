const express = require('express');
const router = express.Router();
const ProductImageController = require('../controllers/productImage.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Initialize controller directly (like authController)
const productImageController = new ProductImageController();

// Configure multer for file uploads
const upload = ProductImageController.configureMulter();

// Public routes (no authentication required)
router.get('/products/:productId/images',
    productImageController.getProductImages
);

// Protected routes (authentication required)
// Note: We'll apply auth middleware to individual routes instead of using router.use()

// Upload product images
router.post('/products/:productId/images/upload',
    // authMiddleware.authenticate,
    // authMiddleware.requireAdmin,
    upload.array('images', 10), // Allow up to 10 images
    ProductImageController.uploadValidationRules(),
    productImageController.validate,
    productImageController.uploadImages
);

// Update product image
router.put('/products/:productId/images/:imageId',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    ProductImageController.updateValidationRules(),
    productImageController.validate,
    productImageController.updateImage
);

// Delete product image
router.delete('/products/:productId/images/:imageId',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productImageController.deleteImage
);

// Set primary image
router.patch('/products/:productId/images/:imageId/primary',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productImageController.setPrimaryImage
);

// Reorder images
router.patch('/products/:productId/images/reorder',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productImageController.reorderImages
);

module.exports = router;
