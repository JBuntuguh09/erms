'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('property', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      house_no: {
        type: DataTypes.STRING
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
          model:'user',
          key: 'id'
        }
      },
      property_type: {
        type: DataTypes.STRING,
        allowNull:true
      },
      occupancy_status: {
        type: DataTypes.STRING,
        allowNull:true
      },
      property_value: {
        type: DataTypes.STRING,
        allowNull:true
      },
      land_area: {
        type: DataTypes.STRING,
        allowNull:true
      },
      revenue_streams_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
      remarks: {
        type: DataTypes.STRING(500),
        allowNull:true
      },
      gpsLocation: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull:false
      },
      registration_date: {
        allowNull: false,
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
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
        type: Sequelize.INTEGER,
        references: {
          model:'user',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('properties');
  }
};