const BaseController = require('./base.controller');
const container = require('../di-container/di-container');

class UserController extends BaseController {
    constructor() {
        super();
        this.userService = container.resolve('userService');
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            return super.convertToJson(res, 200, users);
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await this.userService.getUserById(id);
            return super.convertToJson(res, 200, user);
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const user = await this.userService.createUser(userData);
            return super.convertToJson(res, 201, user);
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async updateUser(req, res) {
        try {
            const id = req.params.id;
            const userData = req.body;
            const user = await this.userService.updateUser(id, userData);
            return super.convertToJson(res, 200, user);
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const success = await this.userService.deleteUser(id);
            return super.convertToJson(res, 200, { success });
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async getUserByEmail(req, res) {
        try {
            const email = req.params.email;
            const user = await this.userService.getUserByEmail(email);
            return super.convertToJson(res, 200, user);
        } catch (error) {
            return super.handleError(res, error);
        }
    }
}

module.exports = new UserController();