'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('billings', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: {
      model:'customer',
      key: 'id'
    }
  },
  action_id: {
    type: DataTypes.INTEGER
  },
  type: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING(600)
  },
  owner_name: {
    type: DataTypes.STRING
  },
  owner_phone: {
    type: DataTypes.STRING
  },
  comunity_id: {
    type: DataTypes.INTEGER,
    references: {
      model:'community',
      key: 'id'
    }
  },
  community_name: {
    type: DataTypes.STRING
  },
  revenue_stream_id: {
    type: DataTypes.STRING
  },
  revenue_stream: {
    type: DataTypes.STRING
  },
  bill_amount: {
    type: DataTypes.STRING
  },
  bill_date: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM(["Active", "Inactive"]),
    defaultValue:"Active"
  },
  bill_status: {
    type: DataTypes.STRING,
    defaultValue:"Pending"
  },
  remarks: {
    type: DataTypes.STRING(500)
  },
  generated_by: {
    type: DataTypes.INTEGER,
    references: {
      model:'user',
      key: 'id'
    }
  },
  validated_by: {
    type: DataTypes.INTEGER,
    references: {
      model:'user',
      key: 'id'
    }
  },
  validation_date: {
    type: DataTypes.DATEONLY
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
  },
  customer_code:{
    type: DataTypes.STRING
  }
}, {
  modelName:'billings',
  tableName:'billings',
  timestamps: true
})