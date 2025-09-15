const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/email/:email', userController.getUserByEmail);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Legacy route for backward compatibility
router.get('/getUser', userController.getAllUsers);

module.exports = router;
