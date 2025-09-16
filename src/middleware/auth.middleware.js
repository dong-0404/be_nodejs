const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthMiddleware {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    // Generate JWT token
    generateToken(payload) {
        return jwt.sign(payload, this.jwtSecret, { 
            expiresIn: this.jwtExpiresIn 
        });
    }

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    // Middleware to authenticate requests
    authenticate = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Access token required'
                });
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            
            const decoded = this.verifyToken(token);
            
            // Find user in database
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
    };

    // Optional authentication (doesn't fail if no token)
    optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                req.user = null;
                return next();
            }

            const token = authHeader.substring(7);
            const decoded = this.verifyToken(token);
            
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            req.user = user || null;
            next();
        } catch (error) {
            req.user = null;
            next();
        }
    };

    // Check if user has specific role
    requireRole = (role) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Authentication required'
                });
            }

            if (req.user.role !== role) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Insufficient permissions'
                });
            }

            next();
        };
    };

    // Check if user is admin
    requireAdmin = this.requireRole('admin');

    // Check if user is the owner or admin
    requireOwnerOrAdmin = (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required'
            });
        }

        const resourceUserId = req.params.userId || req.body.userId;
        
        if (req.user.role === 'admin' || req.user.id.toString() === resourceUserId) {
            return next();
        }

        return res.status(403).json({
            status: 'error',
            message: 'Access denied'
        });
    };
}

module.exports = new AuthMiddleware();
