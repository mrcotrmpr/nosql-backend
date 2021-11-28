const Comment = require('../models/comment.model')
const Subcomment = require('../models/subcomment.model')

module.exports = {

    async create(req, res, next){
        const subcommentProps = req.body;
        await Subcomment.create(subcommentProps)
         .then((subcomment) => {
            Comment.findByIdAndUpdate({_id: req.body.commentId}, {$push: {subcomments: subcomment._id}}, {upsert: true}, function(err, doc) {
                return res.status(200).send(subcomment);
            });
         })
    },

    async getOne (req, res, next) {
        const subcomment = await Subcomment.findById(req.params.id)
        res.status(200).send(subcomment)
    },
    
    async getAll(req, res, next){
        const subcomments = await Subcomment.find()
        res.status(200).send(subcomments)
    },

    async createSelf(req, res, next){
        const subcommentProps = req.body;
        await Subcomment.create(subcommentProps)
         .then((subcomment) => {
            Subcomment.findByIdAndUpdate({_id: req.body.subcommentId}, {$push: {subcomments: subcomment._id}}, {upsert: true}, function(err, doc) {
                return res.status(200).send(subcomment);
            });
         })
    },

    async upvote(req, res, next){
        await Subcomment.findOne({ _id: req.body.id })
        .then((subcomment) => {    
            if(!subcomment){
                res.status(204).send({message: "Subcomment with id" + req.body.id + " was not found"});
            };
            if(subcomment.upvotes.includes(req.body.username)){
                return res.status(405).send({message: "you can only upvote once"});
            }
            if(!subcomment.upvotes.includes(req.body.username)){
                if(subcomment.downvotes.includes(req.body.username)){
                    Subcomment.findByIdAndUpdate({_id: req.body.id}, {$pull: {downvotes: req.body.username}}, {upsert: true}, function(){})
                }
                Subcomment.findByIdAndUpdate({_id: req.body.id}, {$push: {upvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "upvote added"});
                });          
            };
        })
    },

    async downvote(req, res, next){
        await Subcomment.findOne({ _id: req.body.id })
        .then((subcomment) => {    
            if(!subcomment){
                res.status(204).send({message: "Subcomment with id" + req.body.id + " was not found"});
            };
            if(subcomment.downvotes.includes(req.body.username)){
                return res.status(405).send({message: "you can only downvote once"});
            }
            if(!subcomment.downvotes.includes(req.body.username)){
                if(subcomment.upvotes.includes(req.body.username)){
                    Subcomment.findByIdAndUpdate({_id: req.body.id}, {$pull: {upvotes: req.body.username}}, {upsert: true}, function() {})
                }
                Subcomment.findByIdAndUpdate({_id: req.body.id}, {$push: {downvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "downvote added"});
                });
            };
        })
    }
  
}