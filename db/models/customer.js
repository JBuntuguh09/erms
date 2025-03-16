'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('customer', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  },
  customer_id: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{
      notEmpty:{
        msg:"Email can not be empty"
      },
      notNull:{
        msg:"Email canot be null"
      },
      isEmail:{
        msg: "Invalid email address"
      }
      
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{
      notEmpty:{
        msg:"Phone can not be empty"
      },
      notNull:{
        msg:"Phone canot be null"
      }
    }
  },
  community_id: {
    type: DataTypes.INTEGER,
    allowNull:true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull:true
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
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model:'user',
      key: 'id'
    }
  },
  updatedBy: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model:'user',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM("Active", "Inactive"),
    allowNull:false,
    defaultValue:"Active"
  },
  region_id: {
    type: DataTypes.INTEGER
  },
  district_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'customer', // 👈 Explicitly setting the table name
  timestamps: true
});

