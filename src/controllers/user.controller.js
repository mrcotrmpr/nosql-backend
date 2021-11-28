const User = require('../models/user.model')
const neo = require('../../neo')

module.exports = {

    async create(req, res, next){

        const user = new User ({
            username: req.body.username,
            password: req.body.password
        })

        await user.save()

        const session = neo.session()

        await session.run(neo.saveUser, {
            userId: user._id.toString(),
        })
    
        res.status(201).send(user)

    },

    async getOne (req, res, next) {
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    },
    
    async getAll(req, res, next){
        const users = await User.find()
        res.status(200).send(users)
    },

    async changePassword(req, res, next){
        await User.findOne({ username: req.body.username, password: req.body.password })
        .then((user) => {
            if(!user){
                res.status(204).send({message: "Invalid credentials"});
            };
            if(user){
                User.findOneAndUpdate({username: req.body.username}, {$set: {password: req.body.newPassword}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "Password changed"});
                });
            };
        })
    },

    async delete(req, res, next){
        await User.findOne({ username: req.body.username, password: req.body.password })
        .then((user) => {
            if(!user){
                res.status(204).send({message: "Invalid credentials"});
            };

            if(user){
                user.delete()

                const session = neo.session()

                session.run(neo.deleteUser, {
                    userId: user._id.toString(),
                })
            
                return res.status(200).send({message: req.body.username + " has been removed"})
            };
        })
    },    
}

