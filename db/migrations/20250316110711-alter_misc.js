'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    
    await queryInterface.addColumn('revenue_streams', 'district_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('revenue_streams', 'community_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('revenue_streams', 'region_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('revenue_streams', 'status', {
      type: DataTypes.STRING,
      defaultValue:"Active"
    })
   
    await queryInterface.addColumn('role_permissions', 'createdBy', {
      type: DataTypes.INTEGER,
      references:{
        model: "user",
        key:"id"
      }
    })
    await queryInterface.addColumn('role_permissions', 'updatedBy', {
      type: DataTypes.INTEGER,
      references: {
        model:'user',
        key: 'id'
      }
    })
    
    await queryInterface.addColumn('occupancy_status', 'status', {
      type: DataTypes.STRING,
      defaultValue:"Active"
    })
    await queryInterface.addColumn('property_type', 'status', {
      type: DataTypes.STRING
    })

    await queryInterface.addColumn('occupancy_status', 'district_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('occupancy_status', 'community_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('occupancy_status', 'region_id', {
      type: DataTypes.INTEGER
    })

    await queryInterface.addColumn('property_type', 'district_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('property_type', 'community_id', {
      type: DataTypes.INTEGER
    })
    await queryInterface.addColumn('property_type', 'region_id', {
      type: DataTypes.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('revenue_streams', 'district_id');
    await queryInterface.removeColumn('revenue_streams', 'community_id');
    await queryInterface.removeColumn('revenue_streams', 'region_id');
    await queryInterface.removeColumn('revenue_streams', 'status');
    await queryInterface.removeColumn('role_permissions', 'createdBy');
    await queryInterface.removeColumn('role_permissions', 'updatedBy');
    await queryInterface.removeColumn('audit', 'createdBy');
    await queryInterface.removeColumn('audit', 'updatedBy');
    await queryInterface.removeColumn('occupancy_status', 'status');
    await queryInterface.removeColumn('property_type', 'status');
    await queryInterface.removeColumn('occupancy_status', 'district_id');
    await queryInterface.removeColumn('occupancy_status', 'community_id');
    await queryInterface.removeColumn('occupancy_status', 'region_id');
    await queryInterface.removeColumn('property_type', 'district_id');
    await queryInterface.removeColumn('property_type', 'community_id');
    await queryInterface.removeColumn('property_type', 'region_id');
  }
};
