'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add 'type' column to 'region' table
    await queryInterface.addColumn("user", "community_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references:{
        model:"community",
        key:"id"
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
