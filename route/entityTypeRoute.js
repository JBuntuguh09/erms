const { authenticate } = require("../controller/authController");
const { searchAll, insertData } = require("../controller/entityTypeController");
const router = require('express').Router();

router.route('/').get(authenticate, searchAll);
// router.route('/all').get(authenticate, getMyBusiness);
router.route('/new').post(authenticate, insertData);
// router.route('/:id').get(authenticate, getPropertyById);
// router.route('/update').put(authenticate, updateProperty);

module.exports = router;