'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("billings", "action_id");
    
    await queryInterface.addColumn("billings", "action_id", {
      type: Sequelize.INTEGER, // Correct ENUM definition
      allowNull: true
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
