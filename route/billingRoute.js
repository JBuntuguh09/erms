const { authenticate } = require('../controller/authController');
const { getBillings, insertBill, updateBill, getUnBilledBusiness, getUnBilledEntity, getUnBilledProperty } = require('../controller/billingsController');

const router = require('express').Router();

router.route('/').get(authenticate, getBillings);
router.route('/unbilled/business').get(authenticate, getUnBilledBusiness);
router.route('/unbilled/property').get(authenticate, getUnBilledProperty);
router.route('/unbilled/entity').get(authenticate, getUnBilledEntity);
router.route('/new').post(authenticate, insertBill);

router.route('/update').put(authenticate, updateBill);
// router.route('/:id').get(authenticate, getBusiness);
module.exports = router;