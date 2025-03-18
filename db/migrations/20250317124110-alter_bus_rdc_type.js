'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('business_type', 'district_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('business_type', 'community_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('business_type', 'region_id', {
      type: DataTypes.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("business_type", "region_id");
    await queryInterface.removeColumn("business_type", "district_id");
    await queryInterface.removeColumn("business_type", "community_id");
  }
};
