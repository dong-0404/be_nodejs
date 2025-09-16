const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const authController = new AuthController();

// Public routes (no authentication required)
router.post('/register', 
    AuthController.getRegisterValidation(),
    authController.register
);

router.post('/login', 
    AuthController.getLoginValidation(),
    authController.login
);

// Protected routes (authentication required)
router.get('/profile', 
    authMiddleware.authenticate,
    authController.getProfile
);

router.put('/profile', 
    authMiddleware.authenticate,
    AuthController.getUpdateProfileValidation(),
    authController.updateProfile
);

router.post('/change-password', 
    authMiddleware.authenticate,
    AuthController.getChangePasswordValidation(),
    authController.changePassword
);

router.post('/refresh-token', 
    authMiddleware.authenticate,
    authController.refreshToken
);

router.post('/logout', 
    authMiddleware.authenticate,
    authController.logout
);

router.post('/deactivate', 
    authMiddleware.authenticate,
    authController.deactivateAccount
);

// Admin routes
router.post('/reactivate/:userId', 
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    authController.reactivateAccount
);

module.exports = router;
