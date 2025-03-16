const { authenticate } = require('../controller/authController');
const { getDash } = require('../controller/dashController');

const router = require('express').Router();

router.route('/').get(authenticate, getDash);

module.exports = router;