'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add 'district id' column to 'region' table
    await queryInterface.addColumn("community", "district_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references:{
        model:"district",
        key:"id"
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("community", "district_id");
  }
};
