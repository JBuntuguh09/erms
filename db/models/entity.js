'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('entity', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  entity_description: {
    type: DataTypes.STRING(500)
  },

  email: {
    type: DataTypes.STRING,
    allowNull:true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull:false
  },
  community_id: {
    type: DataTypes.INTEGER,
    allowNull:false,
    references: {
      model:'community',
      key: 'id'
    }
  },
  gpsLocation: {
    type: DataTypes.STRING
  },
  revenue_streams_id: {
    type: DataTypes.INTEGER,
    allowNull:true
  },
  remarks: {
    type: DataTypes.STRING(500),
    allowNull:true
  },
  status: {
    type: DataTypes.ENUM("Active, Inactive"),
    allowNull:false
  },
  registration_date: {
    allowNull: false,
    type: DataTypes.DATE
  },
  region_id: {
    type: DataTypes.INTEGER
  },
  district_id: {
    type: DataTypes.INTEGER
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
  tableName:"entity",
  modelName:"entity",
  timestamps:true
});