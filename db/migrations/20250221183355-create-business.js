'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      business_name: {
        type: DataTypes.STRING
      },
      business_type: {
        type: DataTypes.STRING
      },
      account_number: {
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
          model:'community',
          key: 'id'
        }
      },
      revenue_streams_id: {
        type: DataTypes.INTEGER,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business');
  }
};