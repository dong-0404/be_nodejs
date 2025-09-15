'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      // Reviews for Nike Air Max 270
      { productId: 1, userId: 2, rating: 5, title: 'Amazing comfort!', comment: 'These shoes are incredibly comfortable and stylish. Perfect for daily wear.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, userId: 3, rating: 4, title: 'Great shoes', comment: 'Love the design and the Air Max technology. Would recommend!', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, userId: 4, rating: 5, title: 'Perfect fit', comment: 'True to size and very comfortable. Great for running and casual wear.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Reviews for Adidas Ultraboost 22
      { productId: 2, userId: 2, rating: 5, title: 'Best running shoes!', comment: 'The Boost technology is incredible. My feet feel great even after long runs.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, userId: 5, rating: 4, title: 'Good performance', comment: 'Solid running shoes with good cushioning and support.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Reviews for Converse Chuck Taylor
      { productId: 3, userId: 3, rating: 5, title: 'Classic style', comment: 'Timeless design that goes with everything. Classic Converse quality.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, userId: 6, rating: 4, title: 'Good value', comment: 'Affordable and stylish. Perfect for casual wear.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, userId: 7, rating: 5, title: 'Love these!', comment: 'Had these for years and they still look great. Highly recommend.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Reviews for Vans Old Skool
      { productId: 4, userId: 4, rating: 4, title: 'Great skate shoes', comment: 'Perfect for skating and street style. Durable and comfortable.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, userId: 8, rating: 5, title: 'Iconic design', comment: 'The side stripe is iconic. Great quality and style.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Reviews for Puma RS-X Reinvention
      { productId: 5, userId: 5, rating: 4, title: 'Unique style', comment: 'Bold design that stands out. Good comfort and quality.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, userId: 9, rating: 5, title: 'Futuristic look', comment: 'Love the retro-futuristic design. Very comfortable and stylish.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Reviews for New Balance 990v5
      { productId: 6, userId: 6, rating: 5, title: 'Premium quality', comment: 'Excellent craftsmanship and comfort. Worth the price.', isApproved: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, userId: 10, rating: 4, title: 'Great running shoe', comment: 'Good for both running and casual wear. High quality materials.', isApproved: true, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
