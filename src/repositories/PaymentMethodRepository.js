const { Op } = require('sequelize');
const RepositoryInterface = require('../interfaces/repository.interface');

class PaymentMethodRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.PaymentMethod = db.PaymentMethod;
        this.model = db.PaymentMethod;
    }

    // Get payment methods by user ID
    async getUserPaymentMethods(userId) {
        try {
            return await this.PaymentMethod.findAll({
                where: { userId, isActive: true },
                order: [
                    ['isDefault', 'DESC'],
                    ['createdAt', 'DESC']
                ]
            });
        } catch (error) {
            throw new Error(`Failed to get user payment methods: ${error.message}`);
        }
    }

    // Set default payment method
    async setDefaultPaymentMethod(paymentMethodId, userId) {
        const transaction = await this.db.sequelize.transaction();
        try {
            // Unset all other default payment methods for this user
            await this.PaymentMethod.update(
                { isDefault: false },
                { where: { userId, id: { [Op.ne]: paymentMethodId } } },
                { transaction }
            );

            // Set this payment method as default
            await this.PaymentMethod.update(
                { isDefault: true },
                { where: { id: paymentMethodId, userId } },
                { transaction }
            );

            await transaction.commit();
            return await this.getById(paymentMethodId);
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to set default payment method: ${error.message}`);
        }
    }

    // Get default payment method
    async getDefaultPaymentMethod(userId) {
        try {
            return await this.PaymentMethod.findOne({
                where: { userId, isDefault: true, isActive: true }
            });
        } catch (error) {
            throw new Error(`Failed to get default payment method: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.PaymentMethod.findAll();
    }

    async getById(id) {
        return await this.PaymentMethod.findByPk(id);
    }

    async create(data) {
        return await this.PaymentMethod.create(data);
    }

    async update(id, data) {
        await this.PaymentMethod.update(data, { where: { id } });
        return await this.getById(id);
    }

    async delete(id) {
        // Soft delete - set isActive to false
        await this.PaymentMethod.update({ isActive: false }, { where: { id } });
        return true;
    }

    async findBy(conditions) {
        return await this.PaymentMethod.findAll({ where: conditions });
    }

    async count() {
        return await this.PaymentMethod.count();
    }
}

module.exports = PaymentMethodRepository;

