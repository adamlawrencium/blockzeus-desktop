const router = require('express').Router();
const controller = require('./auth.controller');
const authorization = require('../middleware/authorization');

// // // //

// POST /register
router.post('/register', controller.register);

// POST /login
router.post('/login', controller.login);

// POST /logout
router.post('/logout', authorization, controller.logout);

// // // //

module.exports = router;
