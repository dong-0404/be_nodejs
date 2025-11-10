const ServiceInterface = require('../interfaces/service.interface');

class AddressService extends ServiceInterface {
    constructor(addressRepository) {
        super();
        this.addressRepository = addressRepository;
    }

    // Get user addresses
    async getUserAddresses(userId) {
        try {
            return await this.addressRepository.getUserAddresses(userId);
        } catch (error) {
            throw new Error(`Failed to get user addresses: ${error.message}`);
        }
    }

    // Get address by ID
    async getAddressById(addressId, userId) {
        try {
            const address = await this.addressRepository.getById(addressId);
            if (!address) {
                throw new Error('Address not found');
            }
            if (address.userId !== userId) {
                throw new Error('Unauthorized');
            }
            return address;
        } catch (error) {
            throw error;
        }
    }

    // Create address
    async createAddress(userId, addressData) {
        try {
            const address = await this.addressRepository.create({
                ...addressData,
                userId
            });

            // If this is set as default, update others
            if (addressData.isDefault) {
                await this.addressRepository.setDefaultAddress(address.id, userId);
            }

            return address;
        } catch (error) {
            throw new Error(`Failed to create address: ${error.message}`);
        }
    }

    // Update address
    async updateAddress(addressId, userId, addressData) {
        try {
            // Verify ownership
            const existing = await this.addressRepository.getById(addressId);
            if (!existing || existing.userId !== userId) {
                throw new Error('Address not found or unauthorized');
            }

            // Update address
            const address = await this.addressRepository.update(addressId, addressData);

            // If setting as default, update others
            if (addressData.isDefault) {
                await this.addressRepository.setDefaultAddress(addressId, userId);
            }

            return address;
        } catch (error) {
            throw error;
        }
    }

    // Delete address
    async deleteAddress(addressId, userId) {
        try {
            // Verify ownership
            const address = await this.addressRepository.getById(addressId);
            if (!address || address.userId !== userId) {
                throw new Error('Address not found or unauthorized');
            }

            return await this.addressRepository.delete(addressId);
        } catch (error) {
            throw error;
        }
    }

    // Set default address
    async setDefaultAddress(addressId, userId) {
        try {
            // Verify ownership
            const address = await this.addressRepository.getById(addressId);
            if (!address || address.userId !== userId) {
                throw new Error('Address not found or unauthorized');
            }

            return await this.addressRepository.setDefaultAddress(addressId, userId);
        } catch (error) {
            throw error;
        }
    }

    // Get default address
    async getDefaultAddress(userId) {
        try {
            return await this.addressRepository.getDefaultAddress(userId);
        } catch (error) {
            throw new Error(`Failed to get default address: ${error.message}`);
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.addressRepository.getAll();
    }

    async getById(id) {
        return await this.addressRepository.getById(id);
    }

    async create(data) {
        return await this.addressRepository.create(data);
    }

    async update(id, data) {
        return await this.addressRepository.update(id, data);
    }

    async delete(id) {
        return await this.addressRepository.delete(id);
    }

    async validate(data) {
        const errors = [];
        if (!data.fullName) errors.push('Full name is required');
        if (!data.phone) errors.push('Phone is required');
        if (!data.line1) errors.push('Address line 1 is required');
        if (!data.city) errors.push('City is required');
        if (!data.state) errors.push('State is required');
        if (!data.postalCode) errors.push('Postal code is required');
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = AddressService;

