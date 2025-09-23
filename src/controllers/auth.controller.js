const { validationResult } = require('express-validator');
const BaseController = require('./base.controller');
const AuthUtils = require('../utils/AuthUtils');
const container = require('../di-container/di-container');

class AuthController extends BaseController {
    constructor() {
        super();
        this.authService = container.resolve('authService');
    }

    // Validation rules - now using AuthUtils
    static getRegisterValidation() {
        return AuthUtils.getRegisterValidation();
    }

    static getLoginValidation() {
        return AuthUtils.getLoginValidation();
    }

    static getChangePasswordValidation() {
        return AuthUtils.getChangePasswordValidation();
    }

    static getUpdateProfileValidation() {
        return AuthUtils.getUpdateProfileValidation();
    }

    // Register new user
    register = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.error(res, errors.array(), 'Validation failed', 400);
            }

            // Sanitize input data
            const sanitizedData = AuthUtils.sanitizeRegisterData(req.body);

            const result = await this.authService.register(sanitizedData);

            return this.success(res, result, 'User registered successfully');
        } catch (error) {
            return this.error(res, error, error.message, 400);
        }
    };

    // Login user
    login = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.error(res, errors.array(), 'Validation failed', 400);
            }

            // Sanitize input data
            const { email, password } = AuthUtils.sanitizeLoginData(req.body);

            const result = await this.authService.login(email, password);

            return this.success(res, result, 'Login successfully');
        } catch (error) {
            return this.error(res, error, error.message, 400);
        }
    };

    // Get user profile
    getProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const profile = await this.authService.getProfile(userId);

            return this.success(res, { user: profile }, 'Profile retrieved successfully');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };

    // Update user profile
    updateProfile = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.error(res, errors.array(), 'Validation failed', 400);
            }

            const userId = req.user.id;
            
            // Sanitize and clean update data
            const sanitizedData = AuthUtils.sanitizeProfileData(req.body);
            
            // Remove sensitive fields
            delete sanitizedData.password;
            delete sanitizedData.password_hash;
            delete sanitizedData.role;
            delete sanitizedData.id;

            await this.authService.updateProfile(userId, sanitizedData);

            // Re-fetch enriched profile to include totals/points
            const profile = await this.authService.getProfile(userId);
            const combinedUser = {
                ...(profile.user || profile),
                totalOrders: profile.totalOrders ?? 0,
                loyaltyPoints: profile.loyaltyPoints ?? 0,
            };

            return this.success(res, { user: combinedUser }, 'Profile updated successfully');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };

    // Change password
    changePassword = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.error(res, errors.array(), 'Validation failed', 400);
            }

            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            const result = await this.authService.changePassword(userId, currentPassword, newPassword);

            return this.success(res, result, 'Password changed successfully');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };

    // Refresh token
    refreshToken = async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await this.authService.refreshToken(userId);

            return this.success(res, result, 'Token refreshed successfully');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };

    // Logout (client-side token removal)
    logout = async (req, res) => {
        try {
            // Since JWT is stateless, logout is handled client-side
            // In a more advanced setup, you might maintain a token blacklist
            return this.success(res, {}, 'Logout successful');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };

    // Deactivate account
    deactivateAccount = async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await this.authService.deactivateAccount(userId);

            return this.success(res, result, 'Account deactivated successfully');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };

    // Reactivate account (admin only)
    reactivateAccount = async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await this.authService.reactivateAccount(userId);

            return this.success(res, result, 'Account reactivated successfully');
        } catch (error) {
            return this.error(res, error, error.message || 'Error', 400);
        }
    };
}

module.exports = AuthController;
