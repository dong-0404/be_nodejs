const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brand.controller');

const brandController = new BrandController();

// Public routes (no authentication required)
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);
router.get('/brands/slug/:slug', brandController.getBrandBySlug);

module.exports = router;


