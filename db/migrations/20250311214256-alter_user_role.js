'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "user_role")
    await queryInterface.addColumn("user", "user_role_id", {
      type: Sequelize.INTEGER, // Correct ENUM definition
      allowNull: true
  });
  },

  async down (queryInterface, Sequelize) {
    
  }
};
