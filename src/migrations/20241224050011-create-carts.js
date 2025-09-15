'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allow guest carts
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: true // For guest carts
      },
      status: {
        type: Sequelize.ENUM('active', 'converted', 'abandoned'),
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('Carts', ['userId']);
    await queryInterface.addIndex('Carts', ['sessionId']);
    await queryInterface.addIndex('Carts', ['status']);
    await queryInterface.addIndex('Carts', ['userId', 'status']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};
