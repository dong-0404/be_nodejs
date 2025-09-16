const { User } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    // Register new user
    async register(userData) {
        try {
            const { email, password, full_name, phone } = userData;

            // Check if user already exists
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const user = await this.userRepository.create({
                email,
                password_hash: password, // Will be hashed by model hook
                full_name,
                phone,
                role: 'user'
            });

            // Generate JWT token
            const token = authMiddleware.generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            // Find user by email
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check if user is active
            if (!user.is_active) {
                throw new Error('Account is deactivated');
            }

            // Validate password
            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = authMiddleware.generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            throw error;
        }
    }

    // Get user profile
    async getProfile(userId) {
        try {
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            return user.toJSON();
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Remove password from update data if present
            const { password, ...safeUpdateData } = updateData;

            const updatedUser = await this.userRepository.update(userId, safeUpdateData);

            return updatedUser.toJSON();
        } catch (error) {
            throw error;
        }
    }

    // Change password
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Validate current password
            const isValidPassword = await user.validatePassword(currentPassword);
            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            await this.userRepository.update(userId, { password_hash: newPassword });

            return { message: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Refresh token
    async refreshToken(userId) {
        try {
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            if (!user.is_active) {
                throw new Error('Account is deactivated');
            }

            // Generate new JWT token
            const token = authMiddleware.generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            throw error;
        }
    }

    // Deactivate account
    async deactivateAccount(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            await this.userRepository.update(userId, { is_active: false });

            return { message: 'Account deactivated successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Reactivate account
    async reactivateAccount(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            await this.userRepository.update(userId, { is_active: true });

            return { message: 'Account reactivated successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;
