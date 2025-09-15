'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductVariants', [
      // Nike Air Max 270 - Multiple sizes
      { productId: 1, sku: 'NIKE-AM270-BLK-40', color: 'Black', size: '40', price: 2500000, originalPrice: 3000000, stockQuantity: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, sku: 'NIKE-AM270-BLK-41', color: 'Black', size: '41', price: 2500000, originalPrice: 3000000, stockQuantity: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, sku: 'NIKE-AM270-BLK-42', color: 'Black', size: '42', price: 2500000, originalPrice: 3000000, stockQuantity: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, sku: 'NIKE-AM270-WHT-40', color: 'White', size: '40', price: 2500000, originalPrice: 3000000, stockQuantity: 12, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, sku: 'NIKE-AM270-WHT-41', color: 'White', size: '41', price: 2500000, originalPrice: 3000000, stockQuantity: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Adidas Ultraboost 22 - Multiple sizes
      { productId: 2, sku: 'ADIDAS-UB22-BLK-40', color: 'Black', size: '40', price: 3200000, originalPrice: 3500000, stockQuantity: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, sku: 'ADIDAS-UB22-BLK-41', color: 'Black', size: '41', price: 3200000, originalPrice: 3500000, stockQuantity: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, sku: 'ADIDAS-UB22-BLK-42', color: 'Black', size: '42', price: 3200000, originalPrice: 3500000, stockQuantity: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, sku: 'ADIDAS-UB22-WHT-40', color: 'White', size: '40', price: 3200000, originalPrice: 3500000, stockQuantity: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, sku: 'ADIDAS-UB22-WHT-41', color: 'White', size: '41', price: 3200000, originalPrice: 3500000, stockQuantity: 12, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Converse Chuck Taylor - Multiple sizes
      { productId: 3, sku: 'CONVERSE-CT-BLK-40', color: 'Black', size: '40', price: 1200000, originalPrice: 1200000, stockQuantity: 25, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, sku: 'CONVERSE-CT-BLK-41', color: 'Black', size: '41', price: 1200000, originalPrice: 1200000, stockQuantity: 30, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, sku: 'CONVERSE-CT-BLK-42', color: 'Black', size: '42', price: 1200000, originalPrice: 1200000, stockQuantity: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, sku: 'CONVERSE-CT-WHT-40', color: 'White', size: '40', price: 1200000, originalPrice: 1200000, stockQuantity: 18, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, sku: 'CONVERSE-CT-WHT-41', color: 'White', size: '41', price: 1200000, originalPrice: 1200000, stockQuantity: 22, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Vans Old Skool - Multiple sizes
      { productId: 4, sku: 'VANS-OS-BLK-40', color: 'Black', size: '40', price: 1800000, originalPrice: 2000000, stockQuantity: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, sku: 'VANS-OS-BLK-41', color: 'Black', size: '41', price: 1800000, originalPrice: 2000000, stockQuantity: 18, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, sku: 'VANS-OS-BLK-42', color: 'Black', size: '42', price: 1800000, originalPrice: 2000000, stockQuantity: 12, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, sku: 'VANS-OS-WHT-40', color: 'White', size: '40', price: 1800000, originalPrice: 2000000, stockQuantity: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, sku: 'VANS-OS-WHT-41', color: 'White', size: '41', price: 1800000, originalPrice: 2000000, stockQuantity: 14, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Puma RS-X Reinvention - Multiple sizes
      { productId: 5, sku: 'PUMA-RSX-BLK-40', color: 'Black', size: '40', price: 2200000, originalPrice: 2500000, stockQuantity: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, sku: 'PUMA-RSX-BLK-41', color: 'Black', size: '41', price: 2200000, originalPrice: 2500000, stockQuantity: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, sku: 'PUMA-RSX-BLK-42', color: 'Black', size: '42', price: 2200000, originalPrice: 2500000, stockQuantity: 7, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, sku: 'PUMA-RSX-WHT-40', color: 'White', size: '40', price: 2200000, originalPrice: 2500000, stockQuantity: 9, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, sku: 'PUMA-RSX-WHT-41', color: 'White', size: '41', price: 2200000, originalPrice: 2500000, stockQuantity: 11, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      
      // New Balance 990v5 - Multiple sizes
      { productId: 6, sku: 'NB-990V5-GRY-40', color: 'Gray', size: '40', price: 2800000, originalPrice: 3000000, stockQuantity: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, sku: 'NB-990V5-GRY-41', color: 'Gray', size: '41', price: 2800000, originalPrice: 3000000, stockQuantity: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, sku: 'NB-990V5-GRY-42', color: 'Gray', size: '42', price: 2800000, originalPrice: 3000000, stockQuantity: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, sku: 'NB-990V5-BLK-40', color: 'Black', size: '40', price: 2800000, originalPrice: 3000000, stockQuantity: 7, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, sku: 'NB-990V5-BLK-41', color: 'Black', size: '41', price: 2800000, originalPrice: 3000000, stockQuantity: 9, isActive: true, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductVariants', null, {});
  }
};
