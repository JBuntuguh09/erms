const { authenticate } = require("../controller/authController");
const { getRolesWithPermiisions, insertRole, getRoles } = require("../controller/roleController");

const router = require('express').Router();
router.route('/').get(authenticate, getRoles);
router.route('/permissions').get(authenticate, getRolesWithPermiisions);
router.route('/new').post(authenticate, insertRole);
// router.route('/:id').get(authenticate, getBusiness);
// router.route('/update').put(authenticate, updateBusiness);


module.exports = router;