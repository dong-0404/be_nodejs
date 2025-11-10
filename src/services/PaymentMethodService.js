const ServiceInterface = require('../interfaces/service.interface');

class PaymentMethodService extends ServiceInterface {
    constructor(paymentMethodRepository) {
        super();
        this.paymentMethodRepository = paymentMethodRepository;
    }

    // Get user payment methods
    async getUserPaymentMethods(userId) {
        try {
            return await this.paymentMethodRepository.getUserPaymentMethods(userId);
        } catch (error) {
            throw new Error(`Failed to get user payment methods: ${error.message}`);
        }
    }

    // Get payment method by ID
    async getPaymentMethodById(paymentMethodId, userId) {
        try {
            const method = await this.paymentMethodRepository.getById(paymentMethodId);
            if (!method) {
                throw new Error('Payment method not found');
            }
            if (method.userId !== userId) {
                throw new Error('Unauthorized');
            }
            return method;
        } catch (error) {
            throw error;
        }
    }

    // Create payment method
    async createPaymentMethod(userId, paymentMethodData) {
        try {
            const method = await this.paymentMethodRepository.create({
                ...paymentMethodData,
                userId
            });

            // If this is set as default, update others
            if (paymentMethodData.isDefault) {
                await this.paymentMethodRepository.setDefaultPaymentMethod(method.id, userId);
            }

            return method;
        } catch (error) {
            throw new Error(`Failed to create payment method: ${error.message}`);
        }
    }

    // Update payment method
    async updatePaymentMethod(paymentMethodId, userId, paymentMethodData) {
        try {
            // Verify ownership
            const existing = await this.paymentMethodRepository.getById(paymentMethodId);
            if (!existing || existing.userId !== userId) {
                throw new Error('Payment method not found or unauthorized');
            }

            // Update payment method
            const method = await this.paymentMethodRepository.update(paymentMethodId, paymentMethodData);

            // If setting as default, update others
            if (paymentMethodData.isDefault) {
                await this.paymentMethodRepository.setDefaultPaymentMethod(paymentMethodId, userId);
            }

            return method;
        } catch (error) {
            throw error;
        }
    }

    // Delete payment method (soft delete)
    async deletePaymentMethod(paymentMethodId, userId) {
        try {
            // Verify ownership
            const method = await this.paymentMethodRepository.getById(paymentMethodId);
            if (!method || method.userId !== userId) {
                throw new Error('Payment method not found or unauthorized');
            }

            return await this.paymentMethodRepository.delete(paymentMethodId);
        } catch (error) {
            throw error;
        }
    }

    // Set default payment method
    async setDefaultPaymentMethod(paymentMethodId, userId) {
        try {
            // Verify ownership
            const method = await this.paymentMethodRepository.getById(paymentMethodId);
            if (!method || method.userId !== userId) {
                throw new Error('Payment method not found or unauthorized');
            }

            return await this.paymentMethodRepository.setDefaultPaymentMethod(paymentMethodId, userId);
        } catch (error) {
            throw error;
        }
    }

    // Get default payment method
    async getDefaultPaymentMethod(userId) {
        try {
            return await this.paymentMethodRepository.getDefaultPaymentMethod(userId);
        } catch (error) {
            throw new Error(`Failed to get default payment method: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.paymentMethodRepository.getAll();
    }

    async getById(id) {
        return await this.paymentMethodRepository.getById(id);
    }

    async create(data) {
        return await this.paymentMethodRepository.create(data);
    }

    async update(id, data) {
        return await this.paymentMethodRepository.update(id, data);
    }

    async delete(id) {
        return await this.paymentMethodRepository.delete(id);
    }

    async validate(data) {
        const errors = [];
        if (!data.type) errors.push('Payment type is required');
        if (!data.provider) errors.push('Payment provider is required');
        if (!['credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cod'].includes(data.type)) {
            errors.push('Invalid payment type');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = PaymentMethodService;

