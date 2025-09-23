'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    });
  },

  async down (queryInterface, Sequelize) {
    // In MySQL, need to drop column and then drop ENUM type if necessary
    await queryInterface.removeColumn('Users', 'role');
    // Note: Sequelize for MySQL doesn't keep separate ENUM types, so nothing else to drop
  }
};
