const { validationResult } = require('express-validator');

class BaseController {
    constructor() {
        // Auto-bind all methods for all controllers
        this.autoBind();
    }

    autoBind() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(name => name !== 'constructor' && typeof this[name] === 'function');
        
        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    // Simple success response
    success(res, data = {}, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    }

    // Simple error response
    error(res, error = {}, message = 'Error', status = 500) {
        return res.status(status).json({
            success: false,
            message,
            error,
        });
    }

    validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.error(res, errors.array(), 'Validation error', 400);
        }
        next();
    }
}
module.exports = BaseController;