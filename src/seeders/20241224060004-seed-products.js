'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        brandId: 1, // Nike
        description: 'The Nike Air Max 270 delivers visible cushioning under every step. The design draws inspiration from Air Max icons, showcasing Nike\'s greatest innovation with its large window and fresh array of colors.',
        shortDescription: 'Visible cushioning with large Air Max window',
        isActive: true,
        isFeatured: true,
        isHot: false,
        isNew: true,
        metaTitle: 'Nike Air Max 270 - Premium Running Shoes',
        metaDescription: 'Experience ultimate comfort with Nike Air Max 270. Features visible Air Max cushioning and modern design.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        brandId: 2, // Adidas
        description: 'The Adidas Ultraboost 22 features responsive Boost midsole technology and Primeknit+ upper for ultimate comfort and performance.',
        shortDescription: 'Responsive Boost technology with Primeknit+ upper',
        isActive: true,
        isFeatured: true,
        isHot: true,
        isNew: false,
        metaTitle: 'Adidas Ultraboost 22 - Performance Running Shoes',
        metaDescription: 'Boost your performance with Adidas Ultraboost 22. Features responsive Boost technology and adaptive fit.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Converse Chuck Taylor All Star',
        slug: 'converse-chuck-taylor-all-star',
        brandId: 3, // Converse
        description: 'The classic Converse Chuck Taylor All Star. A timeless design that has been a favorite for generations.',
        shortDescription: 'Classic canvas sneaker with timeless design',
        isActive: true,
        isFeatured: false,
        isHot: false,
        isNew: false,
        metaTitle: 'Converse Chuck Taylor All Star - Classic Canvas Sneaker',
        metaDescription: 'The iconic Converse Chuck Taylor All Star. Classic design that never goes out of style.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vans Old Skool',
        slug: 'vans-old-skool',
        brandId: 4, // Vans
        description: 'The Vans Old Skool features the iconic side stripe and classic skateboarding design.',
        shortDescription: 'Iconic skateboarding shoe with side stripe',
        isActive: true,
        isFeatured: true,
        isHot: false,
        isNew: true,
        metaTitle: 'Vans Old Skool - Classic Skateboarding Shoe',
        metaDescription: 'The legendary Vans Old Skool. Iconic side stripe design for skateboarding and street style.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Puma RS-X Reinvention',
        slug: 'puma-rs-x-reinvention',
        brandId: 5, // Puma
        description: 'The Puma RS-X Reinvention combines retro styling with modern technology for a bold, futuristic look.',
        shortDescription: 'Retro-futuristic design with modern comfort',
        isActive: true,
        isFeatured: false,
        isHot: true,
        isNew: false,
        metaTitle: 'Puma RS-X Reinvention - Retro-Futuristic Sneaker',
        metaDescription: 'Bold retro-futuristic design meets modern comfort in the Puma RS-X Reinvention.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'New Balance 990v5',
        slug: 'new-balance-990v5',
        brandId: 6, // New Balance
        description: 'The New Balance 990v5 delivers premium comfort and performance with ENCAP midsole technology.',
        shortDescription: 'Premium comfort with ENCAP midsole technology',
        isActive: true,
        isFeatured: true,
        isHot: false,
        isNew: false,
        metaTitle: 'New Balance 990v5 - Premium Running Shoe',
        metaDescription: 'Experience premium comfort with New Balance 990v5. Features ENCAP midsole technology.',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
