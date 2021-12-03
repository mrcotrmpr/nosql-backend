const errors = require("../errors")
const User = require('../models/user.model')

class GenericController {
    constructor(model) {
        this.model = model
    }

    upvote = async (req, res, next) => {
        const user = await User.findOne({username: req.body.username})
        if(user != null){
            await this.model.findOne({ _id: req.body.id })
            .then((entity) => {    
                if(!entity){
                    return res.status(204).send({message: "ID " + req.body.id + " was not found"});
                };
                if(entity.upvotes.includes(req.body.username)){
                    return res.status(405).send({message: "you can only upvote once"});
                }
                if(!entity.upvotes.includes(req.body.username)){
                    if(entity.downvotes.includes(req.body.username)){
                        this.model.findByIdAndUpdate({_id: req.body.id}, {$pull: {downvotes: req.body.username}}, {upsert: true}, function(){})
                    }
                    this.model.findByIdAndUpdate({_id: req.body.id}, {$push: {upvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                        return res.status(200).send({message: "upvote added"});
                    });          
                };
            })
        } else if(user == null) {
            return res.status(204).send()
        }
    }

    downvote = async (req, res, next) => {
        const user = await User.findOne({username: req.body.username})
        if(user != null){
            await this.model.findOne({ _id: req.body.id })
            .then((entity) => {    
                if(!entity){
                    return res.status(204).send({message: "ID " + req.body.id + " was not found"});
                };
                if(entity.downvotes.includes(req.body.username)){
                    return res.status(405).send({message: "you can only downvote once"});
                }
                if(!entity.downvotes.includes(req.body.username)){
                    if(entity.upvotes.includes(req.body.username)){
                        this.model.findByIdAndUpdate({_id: req.body.id}, {$pull: {upvotes: req.body.username}}, {upsert: true}, function() {})
                    }
                    this.model.findByIdAndUpdate({_id: req.body.id}, {$push: {downvotes: req.body.username}}, {upsert: true}, function(err, doc) {
                        return res.status(200).send({message: "downvote added"});
                    });          
                };
            })
        } else if(user == null) {
            return res.status(204).send()
        }
    }

}

module.exports = GenericController