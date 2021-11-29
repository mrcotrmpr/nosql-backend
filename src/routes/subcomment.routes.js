const express = require('express')
const router = express.Router()

const Subomment = require('../models/subcomment.model')
const GenericController = require('../controllers/generic.controller');

const subcommentGenericController = new GenericController(Subomment)
const subcommentController = require('../controllers/subcomment.controller');

// create a subcomment
router.post('/', subcommentController.create)

// get a subcomment
router.get('/:id', subcommentController.getOne)

// get all subcomment
router.get('/', subcommentController.getAll)

// remove a subcomment
router.delete('/', subcommentController.delete)

// create a subcomment of a subcomment
router.post('/self', subcommentController.createSelf)

// upvote a subcomment
router.post('/upvote', subcommentGenericController.upvote)

// downvote a subcomment
router.post('/downvote', subcommentGenericController.downvote)

module.exports = router