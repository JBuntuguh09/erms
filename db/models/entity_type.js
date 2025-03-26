'use strict';
const {
  Model, DataTypes, Sequelize
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('entity_type', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
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
  description:{
    type: DataTypes.STRING(500)
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
  },
  region_id: {
    type: DataTypes.INTEGER
  },
  district_id: {
    type: DataTypes.INTEGER
  },
  community_id: {
    type: DataTypes.INTEGER
  }
},{
  modelName:"entity_type",
  tableName:"entity_type",
  timestamps:true
});