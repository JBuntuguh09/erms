const { authenticate } = require('../controller/authController');
const { getAllEntities, insertEntity, getEntityById, updateEntity, getAllEntitiesByLimit } = require('../controller/entityController');

const router = require('express').Router();

 router.route('/').get(authenticate, getAllEntities);
 router.route('/query').get(authenticate, getAllEntitiesByLimit);
// router.route('/all').get(authenticate, getMyBusiness);
router.route('/new').post(authenticate, insertEntity);
router.route('/:id').get(authenticate, getEntityById);
router.route('/update').put(authenticate, updateEntity);

module.exports = router;