'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_business', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      business_id: {
        type: DataTypes.INTEGER,
        references: {
          model:'business',
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_business');
  }
};