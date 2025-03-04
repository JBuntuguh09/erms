const { authenticate } = require('../controller/authController');
const { getAll, insertCustomer, getAllCreated, getCustomer, updateCustomer, searchAll } = require('../controller/customerController');

const router = require('express').Router();

router.route('/').get(authenticate, getAll);
router.route('/all').get(authenticate, getAllCreated);
router.route('/new').post(authenticate, insertCustomer);

router.route('/update').put(authenticate, updateCustomer);
router.route('/search').get(authenticate, searchAll);
router.route('/:id').get(authenticate, getCustomer);
module.exports = router;