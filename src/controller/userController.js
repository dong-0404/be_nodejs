const User = require('../models/userModel');
const BaseController = require('./baseController');

class UserController extends BaseController {
    constructor() {
        super();
    }

    async getAllUsers(req, res) {
        try {
            const users = [
                {
                    name: 'John Doe',
                    email: 'dongtx04@gmail.com',
                },
                {
                    name: 'Jane Doe',
                    email: 'aaa@gmail.com',
                },
            ];

            super.convertToJson(res, 200, users);
        } catch (error) {
            super.convertToJson(res, 500, { message: 'Server Error', error: error.message });
        }
    }
}

module.exports = new UserController();