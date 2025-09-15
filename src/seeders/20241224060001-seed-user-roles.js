'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Assign admin role to first user (admin@shoestore.com)
    await queryInterface.bulkInsert('UserRoles', [
      {
        userId: 1,
        roleId: 1, // admin role
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // Assign customer role to all other users
    const customerRoles = [];
    for (let i = 2; i <= 10; i++) {
      customerRoles.push({
        userId: i,
        roleId: 2, // customer role
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('UserRoles', customerRoles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRoles', null, {});
  }
};
