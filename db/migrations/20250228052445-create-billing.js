'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('billings', {
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
        type: DataTypes.STRING
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
    await queryInterface.dropTable('billings');
  }
};