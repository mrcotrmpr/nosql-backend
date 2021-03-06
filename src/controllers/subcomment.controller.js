const Comment = require('../models/comment.model')
const Subcomment = require('../models/subcomment.model')
const User = require('../models/user.model')

module.exports = {

    async create(req, res, next){
        const subcommentProps = req.body;
        const comment = await Comment.findOne({_id: subcommentProps.commentId})
        const user = await User.findOne({username: subcommentProps.username})
        if(comment != null && user != null){
            await Subcomment.create(subcommentProps)
            .then((subcomment) => {
               Comment.findByIdAndUpdate({_id: req.body.commentId}, {$push: {subcomments: subcomment._id}}, {upsert: true}, function(err, doc) {
                   return res.status(200).send(subcomment);
               });
            })
        } else if(comment == null || user == null){
            return res.status(204).send()
        }
    },

    async getOne (req, res, next) {
        const subcomment = await Subcomment.findById(req.params.id)
        res.status(200).send(subcomment)
    },
    
    async getAll(req, res, next){
        const subcomments = await Subcomment.find()
        res.status(200).send(subcomments)
    },

    async delete(req, res, next){
        await Subcomment.findOne({ _id: req.params.id })
        .then((subcomment) => {
            if(!subcomment){
                res.status(204).send({message: "Subcomment with id" + req.params.id + " was not found"});
            };
            if(subcomment){
                subcomment.delete()
                .then(() => {
                    return res.status(200).send({message: "Subcomment deleted"});
                 })
            };
        })
    },

    async createSelf(req, res, next){
        const subcommentProps = req.body;
        const comment = await Comment.findOne({_id: subcommentProps.commentId})
        const subComment = await Subcomment.findOne({_id: subcommentProps.subcommentId})
        const user = await User.findOne({username: subcommentProps.username})

        if(comment != null && user != null && subComment != null){
            await Subcomment.create(subcommentProps)
            .then((subcomment) => {
               Subcomment.findByIdAndUpdate({_id: req.body.subcommentId}, {$push: {subcomments: subcomment._id}}, {upsert: true}, function(err, doc) {
                   return res.status(200).send(subcomment);
               });
            })
        } else if(comment == null || user == null || subComment == null){
            return res.status(204).send()
        }
    }  
}