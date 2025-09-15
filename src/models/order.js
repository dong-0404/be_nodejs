'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order belongs to a user
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Order has many items
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
      });

      // Order has many addresses (shipping, billing)
      Order.hasMany(models.OrderAddress, {
        foreignKey: 'orderId',
        as: 'addresses'
      });
    }
  }
  Order.init({
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'paid', 'refunded', 'partially_refunded'),
      defaultValue: 'unpaid'
    },
    paymentProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    placedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true
  });
  return Order;
};
