const db = require('../models');
const UserRepository = require('../repositories/UserRepository');
const OrderRepository = require('../repositories/OrderRepository');
const ProductRepository = require('../repositories/ProductRepository');
const CategoryRepository = require('../repositories/CategoryRepository');
const BrandRepository = require('../repositories/BrandRepository');
const CartRepository = require('../repositories/CartRepository');
const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');
const ProductService = require('../services/ProductService');
const CartService = require('../services/CartService');

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
container.register('orderRepository', (container) => new OrderRepository(container.resolve('db')));
container.register('productRepository', (container) => new ProductRepository(container.resolve('db')));
container.register('categoryRepository', (container) => new CategoryRepository(container.resolve('db')));
container.register('brandRepository', (container) => new BrandRepository(container.resolve('db')));
container.register('cartRepository', (container) => new CartRepository(container.resolve('db')));
container.register('userService', (container) => new UserService(container.resolve('userRepository')));
container.register('authService', (container) => new AuthService(container.resolve('userRepository'), container.resolve('orderRepository')));
container.register('productService', (container) => new ProductService(
    container.resolve('productRepository'),
    container.resolve('categoryRepository'),
    container.resolve('brandRepository')
));
container.register('cartService', (container) => new CartService(
    container.resolve('cartRepository'),
    container.resolve('productRepository')
));

module.exports = container;
