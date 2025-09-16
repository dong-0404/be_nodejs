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

    convertToJson(res, statusCode, data) {
        return res.status(statusCode).json({
            status: statusCode === 200 || statusCode === 201 ? 'success' : 'error',
            data,
        });
    }

    validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array(),
            });
        }
        next();
    }

    handleError(res, error) {
        console.error(error); 
        return this.convertToJson(res, 500, { message: error.message || 'Internal Server Error' });
    }
}
module.exports = BaseController;