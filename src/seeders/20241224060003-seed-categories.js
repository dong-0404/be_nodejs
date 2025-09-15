'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Casual and athletic sneakers',
        parentId: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Running',
        slug: 'running',
        description: 'Running shoes for all terrains',
        parentId: null,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Basketball',
        slug: 'basketball',
        description: 'High-performance basketball shoes',
        parentId: null,
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Fashion and lifestyle shoes',
        parentId: null,
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Football',
        slug: 'football',
        description: 'Football and soccer cleats',
        parentId: null,
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tennis',
        slug: 'tennis',
        description: 'Tennis court shoes',
        parentId: null,
        isActive: true,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
