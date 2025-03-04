const { authenticate } = require('../controller/authController');
const { getAllCommunities, insertCommunity, getCommunity, updateCommunity, searchCommunity } = require('../controller/communityController');

const router = require('express').Router();

router.route('/').get(authenticate, getAllCommunities);
router.route('/new').post(authenticate, insertCommunity);
router.route('/communities').get(authenticate, searchCommunity);
router.route('/update').put(authenticate, updateCommunity);
router.route('/:id').get(authenticate, getCommunity);
module.exports = router;