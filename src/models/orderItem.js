'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // OrderItem belongs to an order
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });

      // OrderItem belongs to a product
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });

      // OrderItem belongs to a product variant (optional)
      OrderItem.belongsTo(models.ProductVariant, {
        foreignKey: 'productVariantId',
        as: 'productVariant'
      });
    }
  }
  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    productVariantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ProductVariants',
        key: 'id'
      }
    },
    nameSnapshot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brandSnapshot: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageSnapshot: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skuSnapshot: {
      type: DataTypes.STRING,
      allowNull: true
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItems',
    timestamps: true
  });
  return OrderItem;
};
