const { authenticate } = require('../controller/authController');
const { getAllEntities, insertEntity, getEntityById, updateEntity } = require('../controller/entityController');

const router = require('express').Router();

 router.route('/').get(authenticate, getAllEntities);
// router.route('/all').get(authenticate, getMyBusiness);
router.route('/new').post(authenticate, insertEntity);
router.route('/:id').get(authenticate, getEntityById);
router.route('/update').put(authenticate, updateEntity);

module.exports = router;