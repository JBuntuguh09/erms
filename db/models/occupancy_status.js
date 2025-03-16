'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('occupancy_status', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
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
}, {
  tableName:"occupancy_status",
  modelName:"occupancy_status",
  timestamps:true
});

