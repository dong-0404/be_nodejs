const IRepository = require('../interfaces/repository.interface');

class OrderRepository extends IRepository {
    constructor(db) {
        super();
        this.db = db;
        this.model = this.db.Order;
    }

    async countByUser(userId, where = {}) {
        return await this.model.count({ where: { userId, ...where } });
    }

    async sumByUser(userId, field, where = {}) {
        const sum = await this.model.sum(field, { where: { userId, ...where } });
        return Number(sum || 0);
    }
}

module.exports = OrderRepository;
