const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

const orderController = new OrderController();

// All order routes require authentication
router.post('/orders',
    authMiddleware.authenticate,
    OrderController.createOrderValidationRules(),
    orderController.validate,
    orderController.createOrder
);

router.get('/orders',
    authMiddleware.authenticate,
    orderController.getUserOrders
);

router.get('/orders/:orderId',
    authMiddleware.authenticate,
    orderController.getOrderById
);

router.put('/orders/:orderId/cancel',
    authMiddleware.authenticate,
    orderController.cancelOrder
);

module.exports = router;

