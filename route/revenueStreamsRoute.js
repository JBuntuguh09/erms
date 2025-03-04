const { authenticate } = require('../controller/authController');
const { getAllReveStreams, insertrevStream, getRevStream, updateRevStreans } = require('../controller/revenueStreamsController');

const router = require('express').Router();

router.route('/').get(authenticate, getAllReveStreams);
router.route('/new').post(authenticate, insertrevStream);
router.route('/:id').get(authenticate, getRevStream);
router.route('/update').put(authenticate, updateRevStreans);

module.exports = router;