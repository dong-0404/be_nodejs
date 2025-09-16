const { body } = require('express-validator');

class AuthUtils {
    /**
     * Validation rules for user registration
     */
    static getRegisterValidation() {
        return [
            body('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('Please provide a valid email'),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
            body('full_name')
                .trim()
                .isLength({ min: 2, max: 50 })
                .withMessage('Full name must be between 2 and 50 characters long')
                .matches(/^[a-zA-Z\s]+$/)
                .withMessage('Full name can only contain letters and spaces'),
            body('phone')
                .optional()
                .isMobilePhone('vi-VN')
                .withMessage('Please provide a valid Vietnamese phone number')
        ];
    }

    /**
     * Validation rules for user login
     */
    static getLoginValidation() {
        return [
            body('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('Please provide a valid email'),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
        ];
    }

    /**
     * Validation rules for changing password
     */
    static getChangePasswordValidation() {
        return [
            body('currentPassword')
                .notEmpty()
                .withMessage('Current password is required'),
            body('newPassword')
                .isLength({ min: 6 })
                .withMessage('New password must be at least 6 characters long')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
        ];
    }

    /**
     * Validation rules for updating profile
     */
    static getUpdateProfileValidation() {
        return [
            body('full_name')
                .optional()
                .trim()
                .isLength({ min: 2, max: 50 })
                .withMessage('Full name must be between 2 and 50 characters long')
                .matches(/^[a-zA-Z\s]+$/)
                .withMessage('Full name can only contain letters and spaces'),
            body('phone')
                .optional()
                .isMobilePhone('vi-VN')
                .withMessage('Please provide a valid Vietnamese phone number'),
            body('avatar_url')
                .optional()
                .isURL()
                .withMessage('Avatar URL must be a valid URL')
        ];
    }

    /**
     * Sanitize user data for registration
     */
    static sanitizeRegisterData(data) {
        return {
            email: data.email?.toLowerCase().trim(),
            password: data.password,
            full_name: data.full_name?.trim(),
            phone: data.phone?.trim()
        };
    }

    /**
     * Sanitize user data for login
     */
    static sanitizeLoginData(data) {
        return {
            email: data.email?.toLowerCase().trim(),
            password: data.password
        };
    }

    /**
     * Sanitize profile update data
     */
    static sanitizeProfileData(data) {
        const sanitized = {};
        
        if (data.full_name) sanitized.full_name = data.full_name.trim();
        if (data.phone) sanitized.phone = data.phone.trim();
        if (data.avatar_url) sanitized.avatar_url = data.avatar_url.trim();
        
        return sanitized;
    }

    /**
     * Generate password requirements message
     */
    static getPasswordRequirements() {
        return {
            minLength: 6,
            requirements: [
                'At least 6 characters long',
                'Contains at least one lowercase letter',
                'Contains at least one uppercase letter',
                'Contains at least one number'
            ]
        };
    }

    /**
     * Check if email is valid format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check if password meets requirements
     */
    static isValidPassword(password) {
        const minLength = password.length >= 6;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        return minLength && hasLowercase && hasUppercase && hasNumber;
    }

    /**
     * Generate random password
     */
    static generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    }

    /**
     * Mask email for display (e.g., t***@example.com)
     */
    static maskEmail(email) {
        if (!email || !this.isValidEmail(email)) return email;
        
        const [localPart, domain] = email.split('@');
        const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 1);
        
        return `${maskedLocal}@${domain}`;
    }

    /**
     * Mask phone number for display (e.g., 0123***789)
     */
    static maskPhone(phone) {
        if (!phone || phone.length < 6) return phone;
        
        const start = phone.substring(0, 4);
        const end = phone.substring(phone.length - 3);
        const middle = '*'.repeat(phone.length - 7);
        
        return `${start}${middle}${end}`;
    }
}

module.exports = AuthUtils;
