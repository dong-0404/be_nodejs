'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductCategories', [
      // Nike Air Max 270 - Sneakers, Running
      { productId: 1, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
      
      // Adidas Ultraboost 22 - Running, Lifestyle
      { productId: 2, categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
      
      // Converse Chuck Taylor - Sneakers, Lifestyle
      { productId: 3, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
      
      // Vans Old Skool - Sneakers, Lifestyle
      { productId: 4, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
      
      // Puma RS-X - Sneakers, Lifestyle
      { productId: 5, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
      
      // New Balance 990v5 - Running, Lifestyle
      { productId: 6, categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, categoryId: 4, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', null, {});
  }
};
