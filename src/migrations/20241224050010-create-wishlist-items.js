'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WishlistItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wishlistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Wishlists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('WishlistItems', ['wishlistId']);
    await queryInterface.addIndex('WishlistItems', ['productId']);
    
    // Add unique constraint for wishlist-product combination
    await queryInterface.addIndex('WishlistItems', ['wishlistId', 'productId'], {
      unique: true,
      name: 'wishlist_product_unique'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WishlistItems');
  }
};
