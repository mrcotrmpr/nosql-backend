const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller');

// create a user
router.post('/', userController.create)

// get a user
router.get('/:id', userController.getOne)

// get all users
router.get('/', userController.getAll)

// get liked threads from friends
router.post('/recommendations', userController.getRecommendations)

// change password
router.post('/password', userController.changePassword)

// remove user
router.delete('/', userController.delete)

// befriend user
router.post('/befriend', userController.befriendUser)

// defriend user
router.post('/defriend', userController.defriendUser)

module.exports = router