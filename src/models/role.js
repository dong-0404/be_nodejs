'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role belongs to many users through UserRoles
      Role.belongsToMany(models.User, {
        through: 'UserRoles',
        foreignKey: 'roleId',
        otherKey: 'userId',
        as: 'users'
      });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles',
    timestamps: true
  });
  return Role;
};
