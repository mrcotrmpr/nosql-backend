const Thread = require('../models/thread.model')
const User = require('../models/user.model')
const neo = require('../../neo')

module.exports = {

    async create(req, res, next){
        const threadProps = req.body;
        const user = await User.findOne({username: threadProps.username})
        if(user != null){
            await Thread.create(threadProps)
            .then(thread => {
               const session = neo.session()
   
               session.run(neo.saveThread, {
                   threadId: thread.id.toString(),
                   threadTitle: thread.title.toString()
               })
           
               res.status(201).send(thread)
            })
        } else if(user == null){
            return res.status(204).send()
        }

    },

    async getOne (req, res, next) {
        const thread = await Thread.findById(req.params.id)
        res.status(200).send(thread)
    },
    
    async getAll(req, res, next){
        const threads = await Thread.find().select('-comments');
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
        await Thread.findOne({ _id: req.params.id })
        .then((thread) => {
            if(!thread){
                res.status(204).send({message: "Thread with id" + req.params.id + " was not found"});
            };
            if(thread){
                thread.delete()

                const session = neo.session()

                session.run(neo.deleteThread, {
                    threadId: thread.id.toString(),
                })
            
                return res.status(200).send({message: "Thread with id" + req.params.id + " has been removed"})
            };
        })
    },

    async upvote(req, res, next){
        const user = await User.findOne({username: req.body.username})
        if(user != null){
            await Thread.findOne({ _id: req.body.id })
            .then((thread) => {    
                if(!thread){
                    return res.status(401).send({message: "Thread with id" + req.body.id + " was not found"});
                };
                if(thread.upvotes.includes(req.body.username)){
                    return res.status(405).send({message: "you can only upvote once"});
                }
                if(!thread.upvotes.includes(req.body.username)){
                    const session = neo.session()
    
                    if(thread.downvotes.includes(req.body.username)){
                        Thread.findByIdAndUpdate({_id: req.body.id}, {$pull: {downvotes: req.body.username}, $inc: {count_downvotes: -1}}, {upsert: true}, function(){})
                    }
                    Thread.findByIdAndUpdate({_id: req.body.id}, {$push: {upvotes: req.body.username}, $inc: {count_upvotes: 1}}, {upsert: true}, function(err, doc) {
                        session.run(neo.likeThread, {
                            username: req.body.username,
                            threadId: req.body.id
                        })
                        return res.status(200).send({message: "upvote added"});
                    });          
                };
            })
        } else if(user == null) {
            return res.status(204).send()
        }
    },

    async downvote(req, res, next){
        const user = await User.findOne({username: req.body.username})
        if(user != null){
            await Thread.findOne({ _id: req.body.id })
            .then((thread) => {    
                if(!thread){
                    return res.status(401).send({message: "Thread with id" + req.body.id + " was not found"});
                };
                if(thread.downvotes.includes(req.body.username)){
                    return res.status(405).send({message: "you can only downvote once"});
                }
                if(!thread.downvotes.includes(req.body.username)){
                    const session = neo.session()
    
                    if(thread.upvotes.includes(req.body.username)){
                        Thread.findByIdAndUpdate({_id: req.body.id}, {$pull: {upvotes: req.body.username}, $inc: {count_upvotes: -1}}, {upsert: true}, function() {})
                    }
                    Thread.findByIdAndUpdate({_id: req.body.id}, {$push: {downvotes: req.body.username}, $inc: {count_downvotes: 1}}, {upsert: true}, function(err, doc) {
                        session.run(neo.dislikeThread, {
                            username: req.body.username,
                            threadId: req.body.id
                        })
                        return res.status(200).send({message: "downvote added"});
                    });          
                };
            })
        } else if(user == null) {
            return res.status(204).send()
        }
    },

    async filterQuery(req, res, next){

        filters = ["upvotes", "diff", "comments"]

        if(req.body.filter == filters[0]){
            result = await Thread.find().sort({"count_upvotes": -1}).select('-comments')
            return res.status(200).send(result)
        }

        if(req.body.filter == filters[1]){
            Thread.aggregate(
                [
                    { "$project": {
                        "_id": 1,
                        "username": 1,
                        "title": 1,
                        "content": 1,
                        "upvotes": 1,
                        "downvotes": 1,
                        "count_upvotes": 1,
                        "count_downvotes": 1,
                        "diff": { $subtract: [ "$count_upvotes", "$count_downvotes" ] }
                    }},
                    { "$sort": { "diff": -1 } }
                ],
                function(err,results) {
                    return res.status(200).send(results)
                }
            )
        }

        if(req.body.filter == filters[2]){
            Thread.aggregate(
                [
                    { "$project": {
                        "_id": 1,
                        "username": 1,
                        "title": 1,
                        "content": 1,
                        "upvotes": 1,
                        "downvotes": 1,
                        "count_upvotes": 1,
                        "count_downvotes": 1,
                        "comments": { "$size": "$comments" }
                    }},
                    { "$sort": { "comments": -1 } }
                ],
                function(err,results) {
                    return res.status(200).send(results)
                }
            )
        }

        else if(!filters.includes(req.body.filter)) {
            return res.status(401).send({message: "filter not found"});
        }

    }

}