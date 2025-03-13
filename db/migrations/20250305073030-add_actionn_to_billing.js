'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("billings", "action_id", {
      type: Sequelize.STRING,
      allowNull: true
    });
    // Add 'type' column to 'billing' table
    await queryInterface.addColumn("billings", "type", {
      type: Sequelize.STRING,
      allowNull: true
    });

    
    await queryInterface.addColumn("billings", "description", {
      type: Sequelize.STRING(600),
      allowNull: true
    });
    await queryInterface.addColumn("billings", "bill_status", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:"Pending"
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
