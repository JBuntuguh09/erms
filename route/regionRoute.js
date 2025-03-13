const { authenticate } = require('../controller/authController');
const { getAllRegions, insertRegion, getRegion, updateRegion, getAllRegionsAndDistrict, getAllRegionsAndDistrictbyRegionId } = require('../controller/regionController');

const router = require('express').Router();

// Get all regions
router.get("/", authenticate, getAllRegions);

// Get all regions with districts
router.get("/with-districts", authenticate, getAllRegionsAndDistrict);

// Get a single region by ID
router.get("/:id", authenticate, getRegion);

// Get all regions with districts filtered by region ID
router.get("/:id/districts", authenticate, getAllRegionsAndDistrictbyRegionId);

// Create a new region
router.post("/new", authenticate, insertRegion);

// Update a region
router.put("/", authenticate, updateRegion);

module.exports = router;

module.exports = router;