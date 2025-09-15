const IService = require('../interfaces/service.interface');

class UserService extends IService {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }

    // Implement generic interface methods
    async getAll() {
        return await this.userRepository.getAll();
    }

    async getById(id) {
        return await this.userRepository.getById(id);
    }

    async create(data) {
        // Validate user data
        const validation = await this.validate(data);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        return await this.userRepository.create(data);
    }

    async update(id, data) {
        // Check if user exists
        const existingUser = await this.userRepository.getById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        return await this.userRepository.update(id, data);
    }

    async delete(id) {
        // Check if user exists
        const existingUser = await this.userRepository.getById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        return await this.userRepository.delete(id);
    }

    async validate(data) {
        const errors = [];

        if (!data.name || data.name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!data.email || data.email.trim().length === 0) {
            errors.push('Email is required');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('Invalid email format');
            }
        }

        if (!data.password || data.password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // User-specific methods
    async getUserByEmail(email) {
        return await this.userRepository.getUserByEmail(email);
    }

    // Backward compatibility methods
    async getAllUsers() {
        return await this.getAll();
    }

    async getUserById(id) {
        return await this.getById(id);
    }

    async createUser(userData) {
        return await this.create(userData);
    }

    async updateUser(id, userData) {
        return await this.update(id, userData);
    }

    async deleteUser(id) {
        return await this.delete(id);
    }

    async validateUser(userData) {
        return await this.validate(userData);
    }
}

module.exports = UserService;