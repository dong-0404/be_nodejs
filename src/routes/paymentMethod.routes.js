const express = require('express');
const router = express.Router();
const PaymentMethodController = require('../controllers/paymentMethod.controller');
const authMiddleware = require('../middleware/auth.middleware');

const paymentMethodController = new PaymentMethodController();

// All payment method routes require authentication
router.get('/payment-methods',
    authMiddleware.authenticate,
    paymentMethodController.getUserPaymentMethods
);

router.get('/payment-methods/default',
    authMiddleware.authenticate,
    paymentMethodController.getDefaultPaymentMethod
);

router.get('/payment-methods/:paymentMethodId',
    authMiddleware.authenticate,
    paymentMethodController.getPaymentMethodById
);

router.post('/payment-methods',
    authMiddleware.authenticate,
    PaymentMethodController.createValidationRules(),
    paymentMethodController.validate,
    paymentMethodController.createPaymentMethod
);

router.put('/payment-methods/:paymentMethodId',
    authMiddleware.authenticate,
    PaymentMethodController.updateValidationRules(),
    paymentMethodController.validate,
    paymentMethodController.updatePaymentMethod
);

router.put('/payment-methods/:paymentMethodId/default',
    authMiddleware.authenticate,
    paymentMethodController.setDefaultPaymentMethod
);

router.delete('/payment-methods/:paymentMethodId',
    authMiddleware.authenticate,
    paymentMethodController.deletePaymentMethod
);

module.exports = router;

