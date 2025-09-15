'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Banners', [
      {
        title: 'New Collection 2024',
        subtitle: 'Discover the latest trends',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        linkType: 'category',
        linkValue: 'sneakers',
        sortOrder: 1,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Running Shoes Sale',
        subtitle: 'Up to 30% off on all running shoes',
        imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
        linkType: 'category',
        linkValue: 'running',
        sortOrder: 2,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Limited Edition',
        subtitle: 'Exclusive designs available now',
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
        linkType: 'product',
        linkValue: '1', // Nike Air Max 270
        sortOrder: 3,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Banners', null, {});
  }
};
