'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('audits', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER
  },
  action: {
    type: DataTypes.STRING
  },
  affectedData: {
    type: DataTypes.STRING
  },
  result: {
    type: DataTypes.STRING
  },
  ipAddress: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
},{
  modelName:"audit",
  tableName:"audit",
  timestamps:true
});