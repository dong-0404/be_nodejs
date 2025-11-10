const BaseController = require('./base.controller');
const container = require('../di-container/di-container');

class BrandController extends BaseController {
    constructor() {
        super();
        this.brandRepository = container.resolve('brandRepository');
    }

    // Get all brands
    async getAllBrands(req, res) {
        try {
            const { includeInactive = false } = req.query;
            const brands = await this.brandRepository.findAll({
                includeInactive: includeInactive === 'true'
            });
            return this.success(res, { brands }, 'Brands retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get brand by ID
    async getBrandById(req, res) {
        try {
            const { id } = req.params;
            const brand = await this.brandRepository.findById(parseInt(id));
            
            if (!brand) {
                return this.error(res, { message: 'Brand not found' }, 'Brand not found', 404);
            }

            return this.success(res, { brand }, 'Brand retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get brand by slug
    async getBrandBySlug(req, res) {
        try {
            const { slug } = req.params;
            const brand = await this.brandRepository.findBySlug(slug);
            
            if (!brand) {
                return this.error(res, { message: 'Brand not found' }, 'Brand not found', 404);
            }

            return this.success(res, { brand }, 'Brand retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = BrandController;


