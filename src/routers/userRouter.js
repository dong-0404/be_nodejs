const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.get('/getUser', userController.getAllUsers);

module.exports = router;
