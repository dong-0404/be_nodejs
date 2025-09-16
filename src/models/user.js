'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');

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

      // User has many cart items
      User.hasMany(models.CartItem, {
        foreignKey: 'userId',
        as: 'cartItems'
      });
    }

    // Instance methods
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password_hash);
    }

    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password_hash;
      return values;
    }

    // Static methods
    static async hashPassword(password) {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    }

    static async findByEmail(email) {
      return await this.findOne({ where: { email } });
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
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await User.hashPassword(user.password_hash);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await User.hashPassword(user.password_hash);
        }
      }
    }
  });
  return User;
};