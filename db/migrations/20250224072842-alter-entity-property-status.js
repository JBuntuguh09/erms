'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("property", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
          isIn: [["Active", "Inactive"]]
      }
  });
  await queryInterface.changeColumn("entity", "status", {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        isIn: [["Active", "Inactive"]]
    }
});
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.changeColumn("business", "status", {
      type: Sequelize.ENUM("Active", "Inactive"), // Correct ENUM definition
      allowNull: false
  });

  await queryInterface.changeColumn("entity", "status", {
    type: Sequelize.ENUM("Active", "Inactive"), // Correct ENUM definition
    allowNull: false
});
}
};
