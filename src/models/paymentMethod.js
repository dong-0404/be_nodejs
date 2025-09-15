'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      // PaymentMethod belongs to a user
      PaymentMethod.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  PaymentMethod.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cod'),
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false // visa, mastercard, momo, zalopay, vnpay, etc.
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true // visa, mastercard, etc.
    },
    last4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tokenOrRef: {
      type: DataTypes.STRING,
      allowNull: true // Encrypted token or reference from payment provider
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'PaymentMethods',
    timestamps: true
  });
  return PaymentMethod;
};
