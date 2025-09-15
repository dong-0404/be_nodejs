'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Brands',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      shortDescription: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isHot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isNew: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      metaTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      metaDescription: {
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
    await queryInterface.addIndex('Products', ['slug']);
    await queryInterface.addIndex('Products', ['brandId']);
    await queryInterface.addIndex('Products', ['isActive']);
    await queryInterface.addIndex('Products', ['isFeatured', 'isActive']);
    await queryInterface.addIndex('Products', ['isHot', 'isActive']);
    await queryInterface.addIndex('Products', ['isNew', 'isActive']);
    await queryInterface.addIndex('Products', ['name']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
