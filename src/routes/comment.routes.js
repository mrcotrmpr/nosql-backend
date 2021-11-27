const express = require('express')
const router = express.Router()

const commentController = require('../controllers/comment.controller');

// create a comment
router.post('/', commentController.create)

// get a comment
router.get('/:id', commentController.getOne)

// get all comment
router.get('/', commentController.getAll)

// remove a comment
router.delete('/', commentController.delete)

module.exports = router