const express = require('express')
const router = express.Router()

const Comment = require('../models/comment.model')
const GenericController = require('../controllers/generic.controller');

const commentGenericController = new GenericController(Comment)
const commentController = require('../controllers/comment.controller');

// create a comment
router.post('/', commentController.create)

// get a comment
router.get('/:id', commentController.getOne)

// get all comment
router.get('/', commentController.getAll)

// remove a comment
router.delete('/:id', commentController.delete)

// upvote a comment
router.post('/upvote', commentGenericController.upvote)

// downvote a comment
router.post('/downvote', commentGenericController.downvote)

module.exports = router