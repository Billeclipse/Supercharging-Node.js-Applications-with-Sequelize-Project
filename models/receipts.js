'use strict';
const {  Model  } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Receipts extends Model {
    static associate(models) {
    }
  }
  Receipts.init({
    receipt: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Receipts',
  });
  return Receipts;
};