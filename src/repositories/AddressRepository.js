const { Op } = require('sequelize');
const RepositoryInterface = require('../interfaces/repository.interface');

class AddressRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Address = db.Address;
        this.model = db.Address;
    }

    // Get addresses by user ID
    async getUserAddresses(userId) {
        try {
            return await this.Address.findAll({
                where: { userId },
                order: [
                    ['isDefault', 'DESC'],
                    ['createdAt', 'DESC']
                ]
            });
        } catch (error) {
            throw new Error(`Failed to get user addresses: ${error.message}`);
        }
    }

    // Set default address
    async setDefaultAddress(addressId, userId) {
        const transaction = await this.db.sequelize.transaction();
        try {
            // Unset all other default addresses for this user
            await this.Address.update(
                { isDefault: false },
                { where: { userId, id: { [Op.ne]: addressId } } },
                { transaction }
            );

            // Set this address as default
            await this.Address.update(
                { isDefault: true },
                { where: { id: addressId, userId } },
                { transaction }
            );

            await transaction.commit();
            return await this.getById(addressId);
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to set default address: ${error.message}`);
        }
    }

    // Get default address
    async getDefaultAddress(userId) {
        try {
            return await this.Address.findOne({
                where: { userId, isDefault: true }
            });
        } catch (error) {
            throw new Error(`Failed to get default address: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.Address.findAll();
    }

    async getById(id) {
        return await this.Address.findByPk(id);
    }

    async create(data) {
        return await this.Address.create(data);
    }

    async update(id, data) {
        await this.Address.update(data, { where: { id } });
        return await this.getById(id);
    }

    async delete(id) {
        const deleted = await this.Address.destroy({ where: { id } });
        return deleted > 0;
    }

    async findBy(conditions) {
        return await this.Address.findAll({ where: conditions });
    }

    async count() {
        return await this.Address.count();
    }
}

module.exports = AddressRepository;

