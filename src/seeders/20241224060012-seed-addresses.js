'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Addresses', [
      // Customer 2's addresses
      {
        userId: 2,
        fullName: 'Test Customer',
        phone: '+84901234568',
        line1: '123 Nguyen Hue Street',
        line2: 'District 1',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        postalCode: '700000',
        country: 'Vietnam',
        isDefault: true,
        type: 'home',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        fullName: 'Test Customer',
        phone: '+84901234568',
        line1: '456 Le Loi Street',
        line2: 'District 3',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        postalCode: '700000',
        country: 'Vietnam',
        isDefault: false,
        type: 'work',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 3's address
      {
        userId: 3,
        fullName: 'John Doe',
        phone: '+84901234569',
        line1: '789 Dong Khoi Street',
        line2: 'District 1',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        postalCode: '700000',
        country: 'Vietnam',
        isDefault: true,
        type: 'home',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 4's address
      {
        userId: 4,
        fullName: 'Jane Smith',
        phone: '+84901234570',
        line1: '321 Pasteur Street',
        line2: 'District 3',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        postalCode: '700000',
        country: 'Vietnam',
        isDefault: true,
        type: 'home',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
