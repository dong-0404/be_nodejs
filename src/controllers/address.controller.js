const BaseController = require('./base.controller');
const { body, param } = require('express-validator');
const container = require('../di-container/di-container');

class AddressController extends BaseController {
    constructor() {
        super();
        this.addressService = container.resolve('addressService');
    }

    // Validation rules
    static createValidationRules() {
        return [
            body('fullName').notEmpty().withMessage('Full name is required'),
            body('phone').notEmpty().withMessage('Phone is required'),
            body('line1').notEmpty().withMessage('Address line 1 is required'),
            body('city').notEmpty().withMessage('City is required'),
            body('state').notEmpty().withMessage('State is required'),
            body('postalCode').notEmpty().withMessage('Postal code is required'),
            body('country').optional().isString(),
            body('line2').optional().isString(),
            body('type').optional().isIn(['home', 'work', 'other']),
            body('isDefault').optional().isBoolean()
        ];
    }

    static updateValidationRules() {
        return [
            param('addressId').isInt().withMessage('Address ID must be an integer'),
            body('fullName').optional().notEmpty(),
            body('phone').optional().notEmpty(),
            body('line1').optional().notEmpty(),
            body('city').optional().notEmpty(),
            body('state').optional().notEmpty(),
            body('postalCode').optional().notEmpty(),
            body('country').optional().isString(),
            body('line2').optional().isString(),
            body('type').optional().isIn(['home', 'work', 'other']),
            body('isDefault').optional().isBoolean()
        ];
    }

    // Get user addresses
    async getUserAddresses(req, res) {
        try {
            const userId = req.user.id;
            const addresses = await this.addressService.getUserAddresses(userId);
            return this.success(res, addresses.map(a => a.toJSON()), 'Addresses retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get address by ID
    async getAddressById(req, res) {
        try {
            const userId = req.user.id;
            const { addressId } = req.params;
            const address = await this.addressService.getAddressById(parseInt(addressId), userId);
            return this.success(res, address.toJSON(), 'Address retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 404);
        }
    }

    // Create address
    async createAddress(req, res) {
        try {
            const userId = req.user.id;
            const addressData = req.body;
            const address = await this.addressService.createAddress(userId, addressData);
            return this.success(res, address.toJSON(), 'Address created successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Update address
    async updateAddress(req, res) {
        try {
            const userId = req.user.id;
            const { addressId } = req.params;
            const addressData = req.body;
            const address = await this.addressService.updateAddress(parseInt(addressId), userId, addressData);
            return this.success(res, address.toJSON(), 'Address updated successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Delete address
    async deleteAddress(req, res) {
        try {
            const userId = req.user.id;
            const { addressId } = req.params;
            await this.addressService.deleteAddress(parseInt(addressId), userId);
            return this.success(res, null, 'Address deleted successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Set default address
    async setDefaultAddress(req, res) {
        try {
            const userId = req.user.id;
            const { addressId } = req.params;
            const address = await this.addressService.setDefaultAddress(parseInt(addressId), userId);
            return this.success(res, address.toJSON(), 'Default address set successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }

    // Get default address
    async getDefaultAddress(req, res) {
        try {
            const userId = req.user.id;
            const address = await this.addressService.getDefaultAddress(userId);
            if (!address) {
                return this.success(res, null, 'No default address found');
            }
            return this.success(res, address.toJSON(), 'Default address retrieved successfully');
        } catch (error) {
            return this.error(res, { message: error.message }, error.message, 400);
        }
    }
}

module.exports = AddressController;

