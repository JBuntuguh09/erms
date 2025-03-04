const { authenticate } = require('../controller/authController');
const { insertProperty, updateProperty, getAllProperties, getPropertyById } = require('../controller/propertyController');

const router = require('express').Router();

 router.route('/').get(authenticate, getAllProperties);
// router.route('/all').get(authenticate, getMyBusiness);
router.route('/new').post(authenticate, insertProperty);
router.route('/:id').get(authenticate, getPropertyById);
router.route('/update').put(authenticate, updateProperty);

module.exports = router;