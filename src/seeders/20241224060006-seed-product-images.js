'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductImages', [
      // Nike Air Max 270
      { productId: 1, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', altText: 'Nike Air Max 270 Front View', sortOrder: 1, isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', altText: 'Nike Air Max 270 Side View', sortOrder: 2, isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      
      // Adidas Ultraboost 22
      { productId: 2, imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80', altText: 'Adidas Ultraboost 22 Front View', sortOrder: 1, isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80', altText: 'Adidas Ultraboost 22 Side View', sortOrder: 2, isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      
      // Converse Chuck Taylor
      { productId: 3, imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', altText: 'Converse Chuck Taylor Front View', sortOrder: 1, isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', altText: 'Converse Chuck Taylor Side View', sortOrder: 2, isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      
      // Vans Old Skool
      { productId: 4, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', altText: 'Vans Old Skool Front View', sortOrder: 1, isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', altText: 'Vans Old Skool Side View', sortOrder: 2, isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      
      // Puma RS-X Reinvention
      { productId: 5, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', altText: 'Puma RS-X Reinvention Front View', sortOrder: 1, isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', altText: 'Puma RS-X Reinvention Side View', sortOrder: 2, isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      
      // New Balance 990v5
      { productId: 6, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', altText: 'New Balance 990v5 Front View', sortOrder: 1, isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', altText: 'New Balance 990v5 Side View', sortOrder: 2, isPrimary: false, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductImages', null, {});
  }
};
