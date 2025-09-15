'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It',
        logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible is Nothing',
        logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Converse',
        slug: 'converse',
        description: 'All Star',
        logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Converse-Logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vans',
        slug: 'vans',
        description: 'Off The Wall',
        logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Vans-Logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Puma',
        slug: 'puma',
        description: 'Forever Faster',
        logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'New Balance',
        slug: 'new-balance',
        description: 'Fearlessly Independent',
        logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/New-Balance-Logo.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};
