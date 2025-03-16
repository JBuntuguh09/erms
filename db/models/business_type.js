'use strict';
const {
  Model
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('business_types', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  description:{
    type: DataTypes.STRING(500)
  },
  status: {
    type: Sequelize.STRING,
    defaultValue:"Active"
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