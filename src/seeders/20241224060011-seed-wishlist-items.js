'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('WishlistItems', [
      // Customer 2's wishlist items
      { wishlistId: 1, productId: 1, createdAt: new Date(), updatedAt: new Date() }, // Nike Air Max 270
      { wishlistId: 1, productId: 4, createdAt: new Date(), updatedAt: new Date() }, // Vans Old Skool
      
      // Customer 3's wishlist items
      { wishlistId: 2, productId: 2, createdAt: new Date(), updatedAt: new Date() }, // Adidas Ultraboost 22
      { wishlistId: 2, productId: 3, createdAt: new Date(), updatedAt: new Date() }, // Converse Chuck Taylor
      
      // Customer 4's wishlist items
      { wishlistId: 3, productId: 5, createdAt: new Date(), updatedAt: new Date() }, // Puma RS-X Reinvention
      { wishlistId: 3, productId: 6, createdAt: new Date(), updatedAt: new Date() }, // New Balance 990v5
      
      // Customer 5's wishlist items
      { wishlistId: 4, productId: 1, createdAt: new Date(), updatedAt: new Date() }, // Nike Air Max 270
      { wishlistId: 4, productId: 2, createdAt: new Date(), updatedAt: new Date() }, // Adidas Ultraboost 22
      
      // Customer 6's wishlist items
      { wishlistId: 5, productId: 3, createdAt: new Date(), updatedAt: new Date() }, // Converse Chuck Taylor
      { wishlistId: 5, productId: 4, createdAt: new Date(), updatedAt: new Date() }, // Vans Old Skool
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WishlistItems', null, {});
  }
};
