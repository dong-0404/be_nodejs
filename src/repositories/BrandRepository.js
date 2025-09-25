const RepositoryInterface = require('../interfaces/repository.interface');

class BrandRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Brand = db.Brand;
        this.model = db.Brand; // For interface compatibility
    }

    // Implement RepositoryInterface methods
    async getAll() {
        return await this.Brand.findAll({
            order: [['name', 'ASC']]
        });
    }

    async getById(id) {
        return await this.findById(id);
    }

    async count() {
        return await this.Brand.count();
    }

    // Find brand by ID
    async findById(id) {
        try {
            return await this.Brand.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find brand: ${error.message}`);
        }
    }

    // Find brand by slug
    async findBySlug(slug) {
        try {
            return await this.Brand.findOne({ where: { slug } });
        } catch (error) {
            throw new Error(`Failed to find brand by slug: ${error.message}`);
        }
    }

    // Get all brands
    async findAll(options = {}) {
        try {
            const { isActive = true, includeInactive = false } = options;
            
            const where = {};
            if (!includeInactive) {
                where.isActive = isActive;
            }

            return await this.Brand.findAll({
                where,
                order: [['name', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Failed to find brands: ${error.message}`);
        }
    }

    // Create brand
    async create(brandData) {
        try {
            return await this.Brand.create(brandData);
        } catch (error) {
            throw new Error(`Failed to create brand: ${error.message}`);
        }
    }

    // Update brand
    async update(id, updateData) {
        try {
            await this.Brand.update(updateData, { where: { id } });
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Failed to update brand: ${error.message}`);
        }
    }

    // Delete brand
    async delete(id) {
        try {
            const deleted = await this.Brand.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to delete brand: ${error.message}`);
        }
    }
}

module.exports = BrandRepository;
