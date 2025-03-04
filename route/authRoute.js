const { signUp, login, authenticate } = require('../controller/authController');

const router = require('express').Router();

router.route('/signup').post( signUp);
router.route('/login').post(login);

module.exports = router;