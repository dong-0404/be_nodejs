const RepositoryInterface = require('../interfaces/repository.interface');

class CategoryRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Category = db.Category;
        this.model = db.Category; // For interface compatibility
    }

    // Implement RepositoryInterface methods
    async getAll() {
        return await this.Category.findAll({
            order: [['name', 'ASC']]
        });
    }

    async getById(id) {
        return await this.findById(id);
    }

    async count() {
        return await this.Category.count();
    }

    // Find category by ID
    async findById(id) {
        try {
            return await this.Category.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find category: ${error.message}`);
        }
    }

    // Find category by slug
    async findBySlug(slug) {
        try {
            return await this.Category.findOne({ where: { slug } });
        } catch (error) {
            throw new Error(`Failed to find category by slug: ${error.message}`);
        }
    }

    // Get all categories
    async findAll(options = {}) {
        try {
            const { isActive = true, includeInactive = false } = options;
            
            const where = {};
            if (!includeInactive) {
                where.isActive = isActive;
            }

            return await this.Category.findAll({
                where,
                order: [['sortOrder', 'ASC'], ['name', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Failed to find categories: ${error.message}`);
        }
    }

    // Create category
    async create(categoryData) {
        try {
            return await this.Category.create(categoryData);
        } catch (error) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    // Update category
    async update(id, updateData) {
        try {
            await this.Category.update(updateData, { where: { id } });
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    // Delete category
    async delete(id) {
        try {
            const deleted = await this.Category.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }
}

module.exports = CategoryRepository;
