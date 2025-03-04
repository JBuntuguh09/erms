'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entity', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entity_description: {
        type: Sequelize.STRING(500)
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
      gpsLocation: {
        type: DataTypes.STRING
      },
      revenue_streams_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
      remarks: {
        type: DataTypes.STRING(500),
        allowNull:true
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
        type: Sequelize.DATE
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
    await queryInterface.dropTable('entity');
  }
};