const Comment = require('../models/comment.model')
const Thread = require('../models/thread.model')
const User = require('../models/user.model')

module.exports = {

    async create(req, res, next){
        const commentProps = req.body;
        const thread = await Thread.findOne({_id: commentProps.threadId})
        const user = await User.findOne({username: commentProps.username})
        
        if(thread != null && user != null){
            await Comment.create(commentProps)
            .then((comment) => {
               if(Thread.findById(comment.threadId)){
               Thread.findByIdAndUpdate({_id: comment.threadId}, {$push: {comments: comment._id}}, {upsert: true}, function(err, doc) {
                   return res.status(200).send(comment);
               });
               } else {
                   return res.status(204).send({message: "invalid thread id"});
               }
           })
        } else if(thread == null || user == null) {
            return res.status(204).send()
        }
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
        await Comment.findOne({ _id: req.params.id })
        .then((comment) => {
            if(!comment){
                res.status(204).send({message: "Comment with id" + req.params.id + " was not found"});
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
    }
}