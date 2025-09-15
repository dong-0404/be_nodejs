'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    static associate(models) {
      // Banner doesn't have direct associations with other models
      // but can reference products/categories through linkType and linkValue
    }
  }
  Banner.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    linkType: {
      type: DataTypes.ENUM('category', 'product', 'url', 'none'),
      defaultValue: 'none'
    },
    linkValue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Banner',
    tableName: 'Banners',
    timestamps: true
  });
  return Banner;
};
