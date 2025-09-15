const IRepository = require('../interfaces/repository.interface');

class UserRepository extends IRepository {
    constructor(db) {
        super();
        this.db = db;
        this.model = this.db.User; // Chỉ định model
    }
    
    // Implement generic interface methods
    async getAll() {
        return await this.model.findAll();
    }

    async getById(id) {
        return await this.model.findByPk(id);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        return await this.model.update(data, {
            where: { id: id }
        });
    }

    async delete(id) {
        const deletedCount = await this.model.destroy({
            where: { id: id }
        });
        return deletedCount > 0;
    }

    async findBy(conditions) {
        return await this.model.findAll({
            where: conditions
        });
    }

    async count() {
        return await this.model.count();
    }

    // User-specific methods
    async getUserByEmail(email) {
        return await this.model.findOne({
            where: { email: email }
        });
    }

    // Backward compatibility methods
    async getAllUsers() {
        return await this.getAll();
    }

    async getUserById(id) {
        return await this.getById(id);
    }

    async createUser(user) {
        return await this.create(user);
    }

    async updateUser(user) {
        return await this.update(user.id, user);
    }

    async deleteUser(id) {
        return await this.delete(id);
    }
}

module.exports = UserRepository;