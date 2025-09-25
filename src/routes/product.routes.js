const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Initialize controller directly (like authController)
const productController = new ProductController();

// Public routes (no authentication required)
router.get('/products', 
    ProductController.queryValidationRules(),
    productController.validate,
    productController.getProducts
);

router.get('/products/featured',
    productController.getFeaturedProducts
);

router.get('/products/hot',
    productController.getHotProducts
);

router.get('/products/new',
    productController.getNewProducts
);

router.get('/products/search',
    ProductController.queryValidationRules(),
    productController.validate,
    productController.searchProducts
);

router.get('/products/category/:categoryId',
    ProductController.queryValidationRules(),
    productController.validate,
    productController.getProductsByCategory
);

router.get('/products/brand/:brandId',
    ProductController.queryValidationRules(),
    (req, res, next) => req.productController.validate(req, res, next),
    (req, res) => req.productController.getProductsByBrand(req, res)
);

router.get('/products/:id',
    productController.getProductById
);

router.get('/products/slug/:slug',
    productController.getProductBySlug
);

// Protected routes (authentication required)
// Note: We'll apply auth middleware to individual routes instead of using router.use()

// Admin routes (require admin role - you may want to add admin middleware)
router.post('/products',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    ProductController.createValidationRules(),
    productController.validate,
    productController.createProduct
);

router.put('/products/:id',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    ProductController.updateValidationRules(),
    productController.validate,
    productController.updateProduct
);

router.delete('/products/:id',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productController.deleteProduct
);

router.patch('/products/:id/status',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productController.toggleProductStatus
);

router.patch('/products/:id/featured',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productController.toggleFeaturedStatus
);

router.patch('/products/:id/hot',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productController.toggleHotStatus
);

router.patch('/products/:id/new',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productController.toggleNewStatus
);

router.get('/admin/products/stats',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    productController.getProductStats
);

module.exports = router;
