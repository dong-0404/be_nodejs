const BaseController = require('./base.controller');
const { body, param, query } = require('express-validator');
const container = require('../di-container/di-container');

class OrderController extends BaseController {
    constructor() {
        super();
        this.orderService = container.resolve('orderService');
    }

    // Validation rules
    static createOrderValidationRules() {
        return [
            body('shippingAddressId').isInt().withMessage('Shipping address ID must be an integer'),
            body('billingAddressId').optional().isInt().withMessage('Billing address ID must be an integer'),
            body('paymentMethodId').optional().isInt().withMessage('Payment method ID must be an integer'),
            body('paymentMethod').optional().isIn(['cod', 'cash_on_delivery']).withMessage('Unsupported payment method'),
            body('shippingFee').optional().isFloat({ min: 0 }).withMessage('Shipping fee must be a positive number'),
            body('discountAmount').optional().isFloat({ min: 0 }).withMessage('Discount amount must be a positive number'),
            body('taxAmount').optional().isFloat({ min: 0 }).withMessage('Tax amount must be a positive number'),
            body('notes').optional().isString().withMessage('Notes must be a string')
        ];
    }

    // Create order
    async createOrder(req, res) {
        try {
            const userId = req.user.id;
            const orderData = req.body;

            const order = await this.orderService.createOrder(userId, orderData);
            return this.success(res, order.toJSON(), 'Order created successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get order by ID
    async getOrderById(req, res) {
        try {
            const userId = req.user.id;
            const { orderId } = req.params;

            const order = await this.orderService.getOrderById(parseInt(orderId), userId);
            return this.success(res, order.toJSON(), 'Order retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 404);
        }
    }

    // Get user orders
    async getUserOrders(req, res) {
        try {
            const userId = req.user.id;
            const {
                status,
                page = 1,
                limit = 20,
                orderBy = 'createdAt',
                orderDirection = 'DESC'
            } = req.query;

            const options = {
                status,
                page: parseInt(page),
                limit: parseInt(limit),
                orderBy,
                orderDirection
            };

            const result = await this.orderService.getUserOrders(userId, options);
            
            return this.success(res, {
                orders: result.orders.map(o => o.toJSON()),
                pagination: result.pagination
            }, 'Orders retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Cancel order
    async cancelOrder(req, res) {
        try {
            const userId = req.user.id;
            const { orderId } = req.params;

            const order = await this.orderService.cancelOrder(parseInt(orderId), userId);
            return this.success(res, order.toJSON(), 'Order cancelled successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = OrderController;

