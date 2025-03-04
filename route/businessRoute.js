const { authenticate } = require('../controller/authController');
const { getAllBusiness, getMyBusiness, newBusiness, getBusiness, updateBusiness } = require('../controller/businessController');

const router = require('express').Router();

router.route('/').get(authenticate, getAllBusiness);
router.route('/all').get(authenticate, getMyBusiness);
router.route('/new').post(authenticate, newBusiness);
router.route('/:id').get(authenticate, getBusiness);
router.route('/update').put(authenticate, updateBusiness);

module.exports = router;