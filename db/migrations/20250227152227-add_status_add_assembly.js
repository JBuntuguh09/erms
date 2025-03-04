'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('customer', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
          isIn: [["Active", "Inactive"]]
      }, defaultValue:"Active"
    })

    await queryInterface.createTable('Assembly', {

    })
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
