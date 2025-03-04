'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'type' column to 'region' table
    await queryInterface.addColumn("district", "type", {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Tables that need 'region_id' and 'district_id'
    const tables = ["business", "customer", "user", "entity", "property", "billings"];

    for (const table of tables) {
      // Add 'region_id' column
      await queryInterface.addColumn(table, "region_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "region",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      });

      // Add 'district_id' column
      await queryInterface.addColumn(table, "district_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "district",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove columns when rolling back the migration
    await queryInterface.removeColumn("district", "type");

    const tables = ["business", "customer", "user", "entity", "property", "billings"];

    for (const table of tables) {
      await queryInterface.removeColumn(table, "region_id");
      await queryInterface.removeColumn(table, "district_id");
    }
  }
};
