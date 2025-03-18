'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("property", "property_community_id_fkey")
    await queryInterface.removeConstraint("business", "business_community_id_fkey")
  },

  async down (queryInterface, Sequelize) {
    
  }
};
