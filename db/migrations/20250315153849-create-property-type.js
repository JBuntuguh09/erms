'use strict';

const sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('property_type', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      rate: {
        type: DataTypes.STRING
      },
      description:{
        type: DataTypes.STRING(500)
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      createdBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model:'user',
          key: 'id'
        }
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model:'user',
          key: 'id'
        }
      }
    });

    
    // Add a generated column for the formatted ID with prefix
    await queryInterface.sequelize.query(`
      ALTER TABLE property_type
      ADD COLUMN property_type_id VARCHAR(10) GENERATED ALWAYS AS ('PRT' || LPAD(id::TEXT, 5, '0')) STORED;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE customer
      ADD COLUMN customer_id VARCHAR(20) GENERATED ALWAYS AS ('CS' || LPAD(id::TEXT, 7, '0')) STORED;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE business
      ADD COLUMN business_id VARCHAR(20) GENERATED ALWAYS AS ('BS' || LPAD(id::TEXT, 7, '0')) STORED;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE property
      ADD COLUMN property_id VARCHAR(20) GENERATED ALWAYS AS ('PR' || LPAD(id::TEXT, 7, '0')) STORED;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE entity
      ADD COLUMN entity_id VARCHAR(20) GENERATED ALWAYS AS ('ET' || LPAD(id::TEXT, 7, '0')) STORED;
    `);

    await queryInterface.addColumn("role", "createdBy", {
      type: Sequelize.INTEGER, // Correct ENUM definition
      allowNull: true,
      references: {
        model:'user',
        key: 'id'
      }
  });

  await queryInterface.addColumn("role", "updatedBy", {
    type: Sequelize.INTEGER, // Correct ENUM definition
    allowNull: true,
    references: {
      model:'user',
      key: 'id'
    }
});
await queryInterface.addColumn("audit", "createdBy", {
  type: Sequelize.INTEGER, // Correct ENUM definition
  allowNull: true,
  references: {
    model:'user',
    key: 'id'
  }
});

await queryInterface.addColumn("audit", "updatedBy", {
type: Sequelize.INTEGER, // Correct ENUM definition
allowNull: true,
references: {
  model:'user',
  key: 'id'
}
});
  },
  async down(queryInterface, Sequelize) {
    // Remove generated columns
    await queryInterface.removeColumn('property_type', 'property_type_id');
    await queryInterface.removeColumn('customer', 'customer_id');
    await queryInterface.removeColumn('business', 'business_id');
    await queryInterface.removeColumn('property', 'property_id');
    await queryInterface.removeColumn('entity', 'entity_id');

    await queryInterface.dropTable('property_type');
    
  }
};