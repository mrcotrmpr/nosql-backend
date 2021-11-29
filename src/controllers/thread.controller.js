const Thread = require('../models/thread.model')
const neo = require('../../neo')

module.exports = {

    async create(req, res, next){

        const threadProps = req.body;
        await Thread.create(threadProps)
         .then(thread => {
            const session = neo.session()

            session.run(neo.saveThread, {
                threadId: thread.id.toString(),
            })
        
            res.status(201).send(thread)
         })
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
        await Thread.findOne({ _id: req.body.id })
        .then((thread) => {
            if(!thread){
                res.status(204).send({message: "Thread with id" + req.body.id + " was not found"});
            };
            if(thread){
                thread.delete()

                const session = neo.session()

                session.run(neo.deleteThread, {
                    threadId: thread.id.toString(),
                })
            
                return res.status(200).send({message: "Thread with id" + req.body.id + " has been removed"})
            };
        })
    }
}