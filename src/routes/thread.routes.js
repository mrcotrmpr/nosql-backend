const express = require('express')
const router = express.Router()

const Thread = require('../models/thread.model')
const GenericController = require('../controllers/generic.controller');

const threadGenericController = new GenericController(Thread)
const threadController = require('../controllers/thread.controller');

// create a thread
router.post('/', threadController.create)

// get a thread
router.get('/:id', threadController.getOne)

// get all threads
router.get('/', threadController.getAll)

// edit thread
router.put('/', threadController.edit)

// remove thread
router.delete('/', threadController.delete)

// upvote thread
router.post('/upvote', threadGenericController.upvote)

// downvote thread
router.post('/downvote', threadGenericController.downvote)

module.exports = router