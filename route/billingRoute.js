const { authenticate } = require('../controller/authController');
const { getBillings, insertBill, updateBill } = require('../controller/billingsController');

const router = require('express').Router();

router.route('/').get(authenticate, getBillings);
//router.route('/all').get(authenticate, getMyBusiness);
router.route('/new').post(authenticate, insertBill);

router.route('/update').put(authenticate, updateBill);
// router.route('/:id').get(authenticate, getBusiness);
module.exports = router;