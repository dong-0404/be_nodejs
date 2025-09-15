'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Cart belongs to a user (optional for guest carts)
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Cart has many items
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'items'
      });
    }
  }
  Cart.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow guest carts
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true // For guest carts
    },
    status: {
      type: DataTypes.ENUM('active', 'converted', 'abandoned'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    timestamps: true
  });
  return Cart;
};
