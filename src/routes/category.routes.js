const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');

const categoryController = new CategoryController();

// Public routes (no authentication required)
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.get('/categories/slug/:slug', categoryController.getCategoryBySlug);

module.exports = router;


