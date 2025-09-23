'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [orders] = await queryInterface.sequelize.query(`SELECT id FROM Orders ORDER BY id ASC`);
    const [products] = await queryInterface.sequelize.query(`SELECT id, name FROM Products ORDER BY id ASC`);
    const [variants] = await queryInterface.sequelize.query(`SELECT id, sku, price FROM ProductVariants ORDER BY id ASC`);
    if (!orders.length || !products.length) return;

    const now = new Date();
    const items = [];
    const pick = (arr, idx) => arr[idx % arr.length];

    for (let i = 0; i < Math.min(orders.length, 5); i++) {
      const order = orders[i];
      const product = pick(products, i);
      const variant = variants.length ? pick(variants, i) : null;
      const quantity = 1 + (i % 2);
      const unitPrice = variant?.price || 250000;
      items.push({
        orderId: order.id,
        productId: product.id,
        productVariantId: variant?.id || null,
        nameSnapshot: product.name || `Product #${product.id}`,
        brandSnapshot: null,
        imageSnapshot: null,
        skuSnapshot: variant?.sku || null,
        unitPrice,
        originalPrice: null,
        quantity,
        totalPrice: unitPrice * quantity,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert('OrderItems', items, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderItems', null, {});
  }
};
