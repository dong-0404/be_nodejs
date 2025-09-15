'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Category can have parent and children (self-referencing)
      Category.belongsTo(models.Category, {
        foreignKey: 'parentId',
        as: 'parent'
      });
      Category.hasMany(models.Category, {
        foreignKey: 'parentId',
        as: 'children'
      });

      // Category belongs to many products through ProductCategories
      Category.belongsToMany(models.Product, {
        through: 'ProductCategories',
        foreignKey: 'categoryId',
        otherKey: 'productId',
        as: 'products'
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true
  });
  return Category;
};
