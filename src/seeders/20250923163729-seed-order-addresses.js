'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [orders] = await queryInterface.sequelize.query(`SELECT id FROM Orders ORDER BY id ASC LIMIT 3`);
    if (!orders.length) return;

    const now = new Date();
    const addresses = [];

    orders.forEach((o, idx) => {
      addresses.push({
        orderId: o.id,
        type: 'shipping',
        fullName: 'John Doe',
        phone: '090000000' + idx,
        line1: '123 Main St',
        line2: null,
        city: 'Hanoi',
        state: 'HN',
        postalCode: '100000',
        country: 'Vietnam',
        createdAt: now,
        updatedAt: now,
      });
      addresses.push({
        orderId: o.id,
        type: 'billing',
        fullName: 'John Doe',
        phone: '090000000' + idx,
        line1: '123 Main St',
        line2: null,
        city: 'Hanoi',
        state: 'HN',
        postalCode: '100000',
        country: 'Vietnam',
        createdAt: now,
        updatedAt: now,
      });
    });

    await queryInterface.bulkInsert('OrderAddresses', addresses, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderAddresses', null, {});
  }
};
