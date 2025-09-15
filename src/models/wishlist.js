'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      // Wishlist belongs to a user
      Wishlist.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Wishlist has many items
      Wishlist.hasMany(models.WishlistItem, {
        foreignKey: 'wishlistId',
        as: 'items'
      });

      // Wishlist belongs to many products through WishlistItems
      Wishlist.belongsToMany(models.Product, {
        through: 'WishlistItems',
        foreignKey: 'wishlistId',
        otherKey: 'productId',
        as: 'products'
      });
    }
  }
  Wishlist.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'My Wishlist'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'Wishlists',
    timestamps: true
  });
  return Wishlist;
};
