const { authenticate } = require('../controller/authController');
const { getAllDistrict, getAllDistrictByRegion, insertDistrict, getDistrict, updateDistrict, insertDistrictArray } = require('../controller/districtController');

const router = require('express').Router();

router.route('/').get(authenticate, getAllDistrict);
router.route('/region/:id').get(authenticate, getAllDistrictByRegion);
router.route('/new').post(authenticate, insertDistrict);
router.route('/bulk-new').post(authenticate, insertDistrictArray);
router.route('/').get(authenticate, getDistrict);
router.route('/update').put(authenticate, updateDistrict);

module.exports = router;