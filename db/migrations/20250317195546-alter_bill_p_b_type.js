'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn("property", "property_type_id", {
    type: DataTypes.INTEGER,
    allowNull: true
   })
   await queryInterface.addColumn("property", "occupancy_status_id", {
    type: DataTypes.INTEGER,
    allowNull: true
   })
   await queryInterface.addColumn("property", "revenue_stream", {
    type: DataTypes.STRING,
    allowNull: true
   })

   await queryInterface.addColumn("business", "business_type_id", {
    type: DataTypes.INTEGER,
    allowNull: true
   })
   
   await queryInterface.addColumn("business", "revenue_stream", {
    type: DataTypes.STRING,
    allowNull: true
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("business", "business_type_id");
    await queryInterface.removeColumn("business", "revenue_stream");
    await queryInterface.removeColumn("property", "revenue_stream");
    await queryInterface.removeColumn("property", "property_type_id");
    await queryInterface.removeColumn("property", "occupancy_status_id");
  }
};
