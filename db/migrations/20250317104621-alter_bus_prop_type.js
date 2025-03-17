'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("property_type", "type", {
      type: DataTypes.STRING,
      defaultValue:"Fixed"
    });
    await queryInterface.addColumn("business_type", "rate", {
      type: DataTypes.STRING,
      defaultValue:"0"
    });
    await queryInterface.addColumn("business_type", "type", {
      type: DataTypes.STRING,
      defaultValue:"Fixed"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("property_type", "type");
    await queryInterface.removeColumn("business_type", "rate");
    await queryInterface.removeColumn("business_type", "type");
  }
};
