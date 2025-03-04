'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('district', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      region_id: {
        type: DataTypes.INTEGER,
        references:{
          model:'region',
          key:'id'
        }
      },
      status: {
        type: DataTypes.STRING
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
    await queryInterface.dropTable('district');
  }
};