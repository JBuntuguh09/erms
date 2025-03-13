'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS enum_business_status;");
    await queryInterface.changeColumn("business", "status", {
      type: Sequelize.ENUM("Active", "Inactive"), // Correct ENUM definition
      allowNull: false
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("business", "status", {
      type: Sequelize.STRING, // Revert to STRING if needed
      allowNull: false
  });
  }
};
