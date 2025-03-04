'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('customer_entity', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  entity_id: {
    type: DataTypes.INTEGER,
    references: {
      model:'entity',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: {
      model:'customer',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.STRING,
    
  },
  description: {
    type: DataTypes.STRING(500)
    
  },
  status: {
    type: DataTypes.STRING,
    defaultValue:'Active'
    
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
  modelName:'customer_entity',
  tableName: 'customer_entity',
  timestamps:true
});