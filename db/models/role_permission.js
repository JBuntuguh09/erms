'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('role_permissions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  role_id: {
    type: DataTypes.INTEGER,
    references:{
      model:'role',
      key:'id'
    }
  },
  app_route: {
    type: DataTypes.STRING
  },
  allowed:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue:"Active"
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
  tableName:'role_permissions',
  modelName:'role_permissions',
  timestamps: true
});