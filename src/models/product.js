'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product belongs to a brand
      Product.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand'
      });

      // Product belongs to many categories through ProductCategories
      Product.belongsToMany(models.Category, {
        through: 'ProductCategories',
        foreignKey: 'productId',
        otherKey: 'categoryId',
        as: 'categories'
      });

      // Product has many images
      Product.hasMany(models.ProductImage, {
        foreignKey: 'productId',
        as: 'images'
      });

      // Product has many variants
      Product.hasMany(models.ProductVariant, {
        foreignKey: 'productId',
        as: 'variants'
      });

      // Product has many reviews
      Product.hasMany(models.Review, {
        foreignKey: 'productId',
        as: 'reviews'
      });

      // Product belongs to many wishlists through WishlistItems
      Product.belongsToMany(models.Wishlist, {
        through: 'WishlistItems',
        foreignKey: 'productId',
        otherKey: 'wishlistId',
        as: 'wishlists'
      });

      // Product has many cart items through variants
      Product.hasMany(models.CartItem, {
        through: models.ProductVariant,
        foreignKey: 'productId',
        as: 'cartItems'
      });

      // Product has many order items
      Product.hasMany(models.OrderItem, {
        foreignKey: 'productId',
        as: 'orderItems'
      });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Brands',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isNew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true
  });
  return Product;
};
