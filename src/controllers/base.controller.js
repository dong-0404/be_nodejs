const { validationResult } = require('express-validator');

class BaseController {
    constructor() {
        // Auto-bind all methods for all controllers
        this.autoBind();
    }

    autoBind() {
        let proto = this;
        const bound = new Set();

        while (proto && proto !== Object.prototype) {
            Object.getOwnPropertyNames(proto)
                .filter(name => name !== 'constructor' && typeof this[name] === 'function')
                .forEach(method => {
                    if (!bound.has(method)) {
                        this[method] = this[method].bind(this);
                        bound.add(method);
                    }
                });
            proto = Object.getPrototypeOf(proto);
        }
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