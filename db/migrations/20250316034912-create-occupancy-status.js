'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('occupancy_status', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
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
        type: DataTypes.INTEGER,
        references: {
          model:'user',
          key: 'id'
        }
      }
    });

    await queryInterface.removeConstraint('billings', 'billings_customer_id_fkey')
    await queryInterface.changeColumn('billings', 'customer_id', {
      type: DataTypes.STRING
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('occupancy_status');
  }
};