'use strict';
const {
  Model, DataTypes, Sequelize
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('property_type', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  property_type_id:{
    type: Sequelize.VIRTUAL,
    get() {
      const rawValue = this.getDataValue('id');
      return rawValue ? rawValue.toString().padStart(5, '0') : null;
    },
},
  name: {
    type: DataTypes.STRING
  },
  rate: {
    type: DataTypes.STRING
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
  tableName:"property_type",
  modelName:"property_type",
  timestamps:true
})