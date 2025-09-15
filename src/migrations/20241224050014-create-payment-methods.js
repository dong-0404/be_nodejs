'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PaymentMethods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cod'),
        allowNull: false
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false // visa, mastercard, momo, zalopay, vnpay, etc.
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true // visa, mastercard, etc.
      },
      last4: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tokenOrRef: {
        type: Sequelize.STRING,
        allowNull: true // Encrypted token or reference from payment provider
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('PaymentMethods', ['userId']);
    await queryInterface.addIndex('PaymentMethods', ['userId', 'isDefault']);
    await queryInterface.addIndex('PaymentMethods', ['userId', 'isActive']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PaymentMethods');
  }
};
