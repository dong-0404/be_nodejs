'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User has many roles through UserRoles
      User.belongsToMany(models.Role, {
        through: 'UserRoles',
        foreignKey: 'userId',
        otherKey: 'roleId',
        as: 'roles'
      });

      // User has many wishlists
      User.hasMany(models.Wishlist, {
        foreignKey: 'userId',
        as: 'wishlists'
      });

      // User has many carts
      User.hasMany(models.Cart, {
        foreignKey: 'userId',
        as: 'carts'
      });

      // User has many addresses
      User.hasMany(models.Address, {
        foreignKey: 'userId',
        as: 'addresses'
      });

      // User has many payment methods
      User.hasMany(models.PaymentMethod, {
        foreignKey: 'userId',
        as: 'paymentMethods'
      });

      // User has many orders
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });

      // User has many reviews
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        as: 'reviews'
      });

      // User has many notifications
      User.hasMany(models.Notification, {
        foreignKey: 'userId',
        as: 'notifications'
      });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });
  return User;
};