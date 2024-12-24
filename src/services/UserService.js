const UserRepository = require('../repositories/UserRepository');

class UserService {
    constructor() {
    }

    async getAllUsers() {
        console.log('2441241241412');
        return await UserRepository.getAllUsers();
    }

    async getUserById(id) {
        return await UserRepository.getUserById(id);

    }

    async createUser(user) {
        return await UserRepository.createUser(user);
    }

    async updateUser(user) {
        return await UserRepository.updateUser(user);
    }
}

module.exports = new UserService();