'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [carts] = await queryInterface.sequelize.query(`SELECT id FROM Carts ORDER BY id ASC`);
    const [variants] = await queryInterface.sequelize.query(`SELECT id, price FROM ProductVariants ORDER BY id ASC`);

    if (!carts.length || !variants.length) return;

    const now = new Date();
    const items = [];

    for (let i = 0; i < Math.min(carts.length, variants.length, 5); i++) {
      const cart = carts[i];
      const variant = variants[i];
      items.push({
        cartId: cart.id,
        productVariantId: variant.id,
        quantity: 1 + (i % 3),
        priceAtAdd: variant.price || 100000,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert('CartItems', items, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartItems', null, {});
  }
};
