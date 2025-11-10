const BaseController = require('./base.controller');
const container = require('../di-container/di-container');

class CategoryController extends BaseController {
    constructor() {
        super();
        this.categoryRepository = container.resolve('categoryRepository');
    }

    // Get all categories
    async getAllCategories(req, res) {
        try {
            const { includeInactive = false } = req.query;
            const categories = await this.categoryRepository.findAll({
                includeInactive: includeInactive === 'true'
            });
            return this.success(res, { categories }, 'Categories retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get category by ID
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await this.categoryRepository.findById(parseInt(id));
            
            if (!category) {
                return this.error(res, { message: 'Category not found' }, 'Category not found', 404);
            }

            return this.success(res, { category }, 'Category retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get category by slug
    async getCategoryBySlug(req, res) {
        try {
            const { slug } = req.params;
            const category = await this.categoryRepository.findBySlug(slug);
            
            if (!category) {
                return this.error(res, { message: 'Category not found' }, 'Category not found', 404);
            }

            return this.success(res, { category }, 'Category retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = CategoryController;


