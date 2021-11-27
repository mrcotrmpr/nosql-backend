const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller');

// get a user
router.get('/:id', userController.getOne)

// get all users
router.get('/', userController.getAll)

module.exports = router