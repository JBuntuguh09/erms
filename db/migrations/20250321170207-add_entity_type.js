'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("entity", "entity_type_id", {
      type:DataTypes.INTEGER,
    })
    await queryInterface.addColumn("entity", "entity_type", {
      type:DataTypes.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("entity", "entity_type")
    await queryInterface.removeColumn("entity", "entity_type_id")
  }
};
