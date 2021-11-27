const express = require('express')
const router = express.Router()

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

module.exports = router