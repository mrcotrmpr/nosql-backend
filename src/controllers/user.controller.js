const User = require('../models/user.model')

module.exports = {

    async create(req, res, next){
        const userProps = req.body;
        console.log(userProps);
        await User.create(userProps)
         .then(user => res.status(201).send(user))
         .catch(next);
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
                res.status(401).send({message: "Invalid credentials"});
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
                res.status(401).send({message: "Invalid credentials"});
            };
            if(user){
                user.delete()
                return res.status(200).send({message: req.body.username + " has been removed"})
            };
        })
    },    
}

