'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      subtotalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      shippingFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      discountAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      paymentStatus: {
        type: Sequelize.ENUM('unpaid', 'paid', 'refunded', 'partially_refunded'),
        defaultValue: 'unpaid'
      },
      paymentProvider: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      placedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      shippedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('Orders', ['orderNumber']);
    await queryInterface.addIndex('Orders', ['userId']);
    await queryInterface.addIndex('Orders', ['status']);
    await queryInterface.addIndex('Orders', ['paymentStatus']);
    await queryInterface.addIndex('Orders', ['placedAt']);
    await queryInterface.addIndex('Orders', ['userId', 'status']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};
