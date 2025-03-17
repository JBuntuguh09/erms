'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('business_types', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  },
  description:{
    type: DataTypes.STRING(500)
  },
  rate: {
    type: DataTypes.STRING,
    defaultValue:"0"
  },
  status: {
    type: DataTypes.STRING,
    defaultValue:"Active"
  },
  type: {
    type: DataTypes.STRING,
    defaultValue:"Fixed"
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  createdBy: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model:'user',
      key: 'id'
    }
  },
  updatedBy: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model:'user',
      key: 'id'
    }
  }
},{
  modelName:'business_type',
  tableName:'business_type',
  timestamps:true
});