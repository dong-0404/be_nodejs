'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistItem extends Model {
    static associate(models) {
      // WishlistItem belongs to a wishlist
      WishlistItem.belongsTo(models.Wishlist, {
        foreignKey: 'wishlistId',
        as: 'wishlist'
      });

      // WishlistItem belongs to a product
      WishlistItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  WishlistItem.init({
    wishlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Wishlists',
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
    }
  }, {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'WishlistItems',
    timestamps: true
  });
  return WishlistItem;
};
