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
                return this.convertToJson(res, 400, {
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            // Sanitize input data
            const sanitizedData = AuthUtils.sanitizeRegisterData(req.body);

            const result = await this.authService.register(sanitizedData);

            return this.convertToJson(res, 201, {
                message: 'User registered successfully',
                ...result
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Login user
    login = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.convertToJson(res, 400, {
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            // Sanitize input data
            const { email, password } = AuthUtils.sanitizeLoginData(req.body);

            const result = await this.authService.login(email, password);

            return this.convertToJson(res, 200, {
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Get user profile
    getProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const profile = await this.authService.getProfile(userId);

            return this.convertToJson(res, 200, {
                message: 'Profile retrieved successfully',
                user: profile
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Update user profile
    updateProfile = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.convertToJson(res, 400, {
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const userId = req.user.id;
            
            // Sanitize and clean update data
            const sanitizedData = AuthUtils.sanitizeProfileData(req.body);
            
            // Remove sensitive fields
            delete sanitizedData.password;
            delete sanitizedData.password_hash;
            delete sanitizedData.role;
            delete sanitizedData.id;

            const updatedProfile = await this.authService.updateProfile(userId, sanitizedData);

            return this.convertToJson(res, 200, {
                message: 'Profile updated successfully',
                user: updatedProfile
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Change password
    changePassword = async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.convertToJson(res, 400, {
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            const result = await this.authService.changePassword(userId, currentPassword, newPassword);

            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Refresh token
    refreshToken = async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await this.authService.refreshToken(userId);

            return this.convertToJson(res, 200, {
                message: 'Token refreshed successfully',
                ...result
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Logout (client-side token removal)
    logout = async (req, res) => {
        try {
            // Since JWT is stateless, logout is handled client-side
            // In a more advanced setup, you might maintain a token blacklist
            return this.convertToJson(res, 200, {
                message: 'Logout successful'
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Deactivate account
    deactivateAccount = async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await this.authService.deactivateAccount(userId);

            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    // Reactivate account (admin only)
    reactivateAccount = async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await this.authService.reactivateAccount(userId);

            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = AuthController;
