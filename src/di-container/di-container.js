const db = require('../models');
const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');

class DIContainer {
    constructor() {
        this.factories = new Map();
        this.instances = new Map();
    }

    register(name, factory) {
        this.factories.set(name, factory);
    }

    resolve(name) {
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }

        const factory = this.factories.get(name);
        if (!factory) {
            throw new Error(`Dependency ${name} not found`);
        }

        const instance = factory(this);
        this.instances.set(name, instance);
        return instance;
    }
}

// Create and configure the container
const container = new DIContainer();

// Register dependencies
container.register('db', () => db);
container.register('userRepository', (container) => new UserRepository(container.resolve('db')));
container.register('userService', (container) => new UserService(container.resolve('userRepository')));
container.register('authService', (container) => new AuthService(container.resolve('userRepository')));

module.exports = container;
