'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderAddress extends Model {
    static associate(models) {
      // OrderAddress belongs to an order
      OrderAddress.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });
    }
  }
  OrderAddress.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('shipping', 'billing'),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    line1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    line2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Vietnam'
    }
  }, {
    sequelize,
    modelName: 'OrderAddress',
    tableName: 'OrderAddresses',
    timestamps: true
  });
  return OrderAddress;
};
