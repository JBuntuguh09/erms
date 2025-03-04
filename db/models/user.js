'use strict';
const bcrypt = require('bcrypt');
const {
  Model, Sequelize, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');

module.exports = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
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
    allowNull:false,
    unique:true,
    validate:{
      notEmpty:{
        msg:"Phone can not be empty"
      },
      notNull:{
        msg:"Phone canot be null"
      }
      
    }
  },
  password: {
    type: DataTypes.STRING
  },

  confirm_password: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if(value === this.password){
        const hashPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashPassword)
      }else {
         throw new AppError("Password and confirm password must be the same", 404)
      }
    }
  },
  user_role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull:false,
    validate:{
      notEmpty:{
        msg:"User role can not be empty"
      },
      notNull:{
        msg:"User role canot be null"
      }
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
  },
  user_status: {
    type: DataTypes.ENUM("Active", "Inactive")
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  },
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'user',
  tableName:'user'
});