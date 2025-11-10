const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/address.controller');
const authMiddleware = require('../middleware/auth.middleware');

const addressController = new AddressController();

// All address routes require authentication
router.get('/addresses',
    authMiddleware.authenticate,
    addressController.getUserAddresses
);

router.get('/addresses/default',
    authMiddleware.authenticate,
    addressController.getDefaultAddress
);

router.get('/addresses/:addressId',
    authMiddleware.authenticate,
    addressController.getAddressById
);

router.post('/addresses',
    authMiddleware.authenticate,
    AddressController.createValidationRules(),
    addressController.validate,
    addressController.createAddress
);

router.put('/addresses/:addressId',
    authMiddleware.authenticate,
    AddressController.updateValidationRules(),
    addressController.validate,
    addressController.updateAddress
);

router.put('/addresses/:addressId/default',
    authMiddleware.authenticate,
    addressController.setDefaultAddress
);

router.delete('/addresses/:addressId',
    authMiddleware.authenticate,
    addressController.deleteAddress
);

module.exports = router;

