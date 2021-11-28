const Comment = require('../models/comment.model')
const Thread = require('../models/thread.model')

module.exports = {

    async create(req, res, next){
        const commentProps = req.body;
        await Comment.create(commentProps)
         .then((comment) => {
            Thread.findByIdAndUpdate({_id: comment.threadId}, {$push: {comments: comment._id}}, {upsert: true}, function(err, doc) {
                return res.status(200).send(comment);
            });
         })
    },

    async getOne (req, res, next) {
        const comment = await Comment.findById(req.params.id)
        res.status(200).send(comment)
    },
    
    async getAll(req, res, next){
        const comments = await Comment.find()
        res.status(200).send(comments)
    },

    async delete(req, res, next){
        await Comment.findOne({ _id: req.body.id })
        .then((comment) => {
            if(!comment){
                res.status(401).send({message: "Comment with id" + req.body.id + " was not found"});
            };
            if(comment){
                comment.delete()
                .then((comment) => {
                    Thread.findByIdAndUpdate({_id: comment.threadId}, {$pull: {comments: comment._id}}, {upsert: true}, function(err, doc) {
                        return res.status(200).send({message: "Comment deleted"});
                    });
                 })
            };
        })
    },

    async upvote(req, res, next){
        await Comment.findOne({ _id: req.body.id })
        .then((comment) => {    
            if(!comment){
                res.status(401).send({message: "Comment with id" + req.body.id + " was not found"});
            };
            if(comment.upvotes.includes(req.body.username)){
                return res.status(405).send({message: "you can only upvote once"});
            }
            if(!comment.upvotes.includes(req.body.username)){
                if(comment.downvotes.includes(req.body.username)){
                    Comment.findByIdAndUpdate({_id: req.body.id}, {$pull: {downvotes: req.body.username}}, {upsert: true}, function(){})
                }
                Comment.findByIdAndUpdate({_id: req.body.id}, {$push: {upvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "upvote added"});
                });          
            };
        })
    },

    async downvote(req, res, next){
        await Comment.findOne({ _id: req.body.id })
        .then((comment) => {    
            if(!comment){
                res.status(401).send({message: "Comment with id" + req.body.id + " was not found"});
            };
            if(comment.downvotes.includes(req.body.username)){
                return res.status(405).send({message: "you can only downvote once"});
            }
            if(!comment.downvotes.includes(req.body.username)){
                if(comment.upvotes.includes(req.body.username)){
                    Comment.findByIdAndUpdate({_id: req.body.id}, {$pull: {upvotes: req.body.username}}, {upsert: true}, function() {})
                }
                Comment.findByIdAndUpdate({_id: req.body.id}, {$push: {downvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "downvote added"});
                });
            };
        })
    }

}