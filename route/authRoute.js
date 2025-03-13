const { signUp, login, authenticate, getUsers } = require('../controller/authController');

const router = require('express').Router();

router.route('/').get( getUsers);
router.route('/signup').post(signUp);
router.route('/login').post(login);

module.exports = router;