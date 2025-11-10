const BaseController = require('./base.controller');
const { body, param } = require('express-validator');
const container = require('../di-container/di-container');

class PaymentMethodController extends BaseController {
    constructor() {
        super();
        this.paymentMethodService = container.resolve('paymentMethodService');
    }

    // Validation rules
    static createValidationRules() {
        return [
            body('type').isIn(['credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cod']).withMessage('Invalid payment type'),
            body('provider').notEmpty().withMessage('Provider is required'),
            body('brand').optional().isString(),
            body('last4').optional().isString(),
            body('tokenOrRef').optional().isString(),
            body('isDefault').optional().isBoolean(),
            body('expiresAt').optional().isISO8601()
        ];
    }

    static updateValidationRules() {
        return [
            param('paymentMethodId').isInt().withMessage('Payment method ID must be an integer'),
            body('type').optional().isIn(['credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cod']),
            body('provider').optional().notEmpty(),
            body('brand').optional().isString(),
            body('last4').optional().isString(),
            body('tokenOrRef').optional().isString(),
            body('isDefault').optional().isBoolean(),
            body('isActive').optional().isBoolean(),
            body('expiresAt').optional().isISO8601()
        ];
    }

    // Get user payment methods
    async getUserPaymentMethods(req, res) {
        try {
            const userId = req.user.id;
            const methods = await this.paymentMethodService.getUserPaymentMethods(userId);
            return this.success(res, methods.map(m => m.toJSON()), 'Payment methods retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get payment method by ID
    async getPaymentMethodById(req, res) {
        try {
            const userId = req.user.id;
            const { paymentMethodId } = req.params;
            const method = await this.paymentMethodService.getPaymentMethodById(parseInt(paymentMethodId), userId);
            return this.success(res, method.toJSON(), 'Payment method retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 404);
        }
    }

    // Create payment method
    async createPaymentMethod(req, res) {
        try {
            const userId = req.user.id;
            const paymentMethodData = req.body;
            const method = await this.paymentMethodService.createPaymentMethod(userId, paymentMethodData);
            return this.success(res, method.toJSON(), 'Payment method created successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Update payment method
    async updatePaymentMethod(req, res) {
        try {
            const userId = req.user.id;
            const { paymentMethodId } = req.params;
            const paymentMethodData = req.body;
            const method = await this.paymentMethodService.updatePaymentMethod(parseInt(paymentMethodId), userId, paymentMethodData);
            return this.success(res, method.toJSON(), 'Payment method updated successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Delete payment method
    async deletePaymentMethod(req, res) {
        try {
            const userId = req.user.id;
            const { paymentMethodId } = req.params;
            await this.paymentMethodService.deletePaymentMethod(parseInt(paymentMethodId), userId);
            return this.success(res, null, 'Payment method deleted successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Set default payment method
    async setDefaultPaymentMethod(req, res) {
        try {
            const userId = req.user.id;
            const { paymentMethodId } = req.params;
            const method = await this.paymentMethodService.setDefaultPaymentMethod(parseInt(paymentMethodId), userId);
            return this.success(res, method.toJSON(), 'Default payment method set successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get default payment method
    async getDefaultPaymentMethod(req, res) {
        try {
            const userId = req.user.id;
            const method = await this.paymentMethodService.getDefaultPaymentMethod(userId);
            if (!method) {
                return this.success(res, null, 'No default payment method found');
            }
            return this.success(res, method.toJSON(), 'Default payment method retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = PaymentMethodController;

