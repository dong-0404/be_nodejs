'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    users.push({
      email: 'admin@shoestore.com',
      password_hash: adminPassword,
      full_name: 'Admin User',
      phone: '+84901234567',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    users.push({
      email: 'customer@test.com',
      password_hash: customerPassword,
      full_name: 'Test Customer',
      phone: '+84901234568',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create random users
    for (let i = 0; i < 8; i++) {
      const password = await bcrypt.hash('password123', 10);
      users.push({
        email: faker.internet.email(),
        password_hash: password,
        full_name: faker.person.fullName(),
        phone: faker.phone.number(),
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
