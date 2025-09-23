'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`SELECT id FROM Users ORDER BY id ASC LIMIT 1`);
    const userId = users?.[0]?.id;
    if (!userId) return;

    const now = new Date();
    const orders = [
      {
        orderNumber: 'ORD-0001',
        userId,
        status: 'delivered',
        totalAmount: 1500000,
        subtotalAmount: 1400000,
        shippingFee: 50000,
        discountAmount: 0,
        taxAmount: 50000,
        paymentStatus: 'paid',
        paymentProvider: 'cod',
        paymentMethod: 'cash',
        placedAt: now,
        shippedAt: now,
        deliveredAt: now,
        notes: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderNumber: 'ORD-0002',
        userId,
        status: 'shipping',
        totalAmount: 900000,
        subtotalAmount: 850000,
        shippingFee: 50000,
        discountAmount: 0,
        taxAmount: 0,
        paymentStatus: 'paid',
        paymentProvider: 'cod',
        paymentMethod: 'cash',
        placedAt: now,
        shippedAt: now,
        deliveredAt: null,
        notes: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderNumber: 'ORD-0003',
        userId,
        status: 'pending',
        totalAmount: 500000,
        subtotalAmount: 500000,
        shippingFee: 0,
        discountAmount: 0,
        taxAmount: 0,
        paymentStatus: 'unpaid',
        paymentProvider: null,
        paymentMethod: null,
        placedAt: now,
        shippedAt: null,
        deliveredAt: null,
        notes: null,
        createdAt: now,
        updatedAt: now,
      }
    ];

    await queryInterface.bulkInsert('Orders', orders, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
