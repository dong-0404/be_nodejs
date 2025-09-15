'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create default wishlists for all customers (users 2-10)
    const wishlists = [];
    for (let i = 2; i <= 10; i++) {
      wishlists.push({
        userId: i,
        name: 'My Wishlist',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('Wishlists', wishlists, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Wishlists', null, {});
  }
};
