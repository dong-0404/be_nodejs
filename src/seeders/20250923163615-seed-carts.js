'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`SELECT id FROM Users ORDER BY id ASC LIMIT 1`);
    const userId = users?.[0]?.id || null;

    const now = new Date();
    const carts = [
      {
        userId,
        sessionId: null,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        sessionId: null,
        status: 'converted',
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: null,
        sessionId: 'guest-session-001',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }
    ];

    await queryInterface.bulkInsert('Carts', carts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', null, {});
  }
};
