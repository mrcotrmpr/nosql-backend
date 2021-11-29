const Thread = require('../models/thread.model')

module.exports = {

    async create(req, res, next){
        const threadProps = req.body;
        console.log(threadProps);
        await Thread.create(threadProps)
         .then(thread => res.status(201).send(thread))
         .catch(next);
    },

    async getOne (req, res, next) {
        const thread = await Thread.findById(req.params.id)
        res.status(200).send(thread)
    },
    
    async getAll(req, res, next){
        const threads = await Thread.find()
        res.status(200).send(threads)
    },

    async edit(req, res, next){
        await Thread.findOne({ _id: req.body.id })
        .then((thread) => {
            if(!thread){
                res.status(204).send({message: "Thread was not found"});
            };
            if(thread){
                Thread.findOneAndUpdate({_id: req.body.id}, {$set: {content: req.body.content}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({thread});
                });
            };
        })
    },

    async delete(req, res, next){
        await Thread.findOne({ _id: req.body.id })
        .then((thread) => {
            if(!thread){
                res.status(204).send({message: "Thread with id" + req.body.id + " was not found"});
            };
            if(thread){
                thread.delete()
                return res.status(200).send({message: "Thread with id" + req.body.id + " has been removed"})
            };
        })
    },    

    async upvote(req, res, next){
        await Thread.findOne({ _id: req.body.id })
        .then((thread) => {    
            if(!thread){
                res.status(204).send({message: "Thread with id" + req.body.id + " was not found"});
            };
            if(thread.upvotes.includes(req.body.username)){
                return res.status(405).send({message: "you can only upvote once"});
    }
            if(!thread.upvotes.includes(req.body.username)){
                if(thread.downvotes.includes(req.body.username)){
                    Thread.findByIdAndUpdate({_id: req.body.id}, {$pull: {downvotes: req.body.username}}, {upsert: true}, function(){})
                }
                Thread.findByIdAndUpdate({_id: req.body.id}, {$push: {upvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "upvote added"});
                });          
            };
        })
    },

    async downvote(req, res, next){
        await Thread.findOne({ _id: req.body.id })
        .then((thread) => {    
            if(!thread){
                res.status(204).send({message: "Thread with id" + req.body.id + " was not found"});
            };
            if(thread.downvotes.includes(req.body.username)){
                return res.status(405).send({message: "you can only downvote once"});
            }
            if(!thread.downvotes.includes(req.body.username)){
                if(thread.upvotes.includes(req.body.username)){
                    Thread.findByIdAndUpdate({_id: req.body.id}, {$pull: {upvotes: req.body.username}}, {upsert: true}, function() {})
                }
                Thread.findByIdAndUpdate({_id: req.body.id}, {$push: {downvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "downvote added"});
                });          
            };
        })
    },    

}