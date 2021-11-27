const User = require('../models/user.model')

module.exports = {

    async create(req, res, next){
        const userProps = req.body;
        console.log(userProps);
        await User.create(userProps)
         .then(user => res.send(user))
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
        await User.findOne({ userName: req.body.userName, password: req.body.password })
        .then((user) => {
            if(!user){
                res.status(401).send({message: "Invalid credentials"});
            };
            if(user){
                User.findOneAndUpdate({userName: req.body.userName}, {$set: {password: req.body.newPassword}}, {upsert: true}, function(err, doc) {
                    return res.status(200).send({message: "Password changed"});
                });
            };
        })
    },

    async delete(req, res, next){
        await User.findOne({ userName: req.body.userName, password: req.body.password })
        .then((user) => {
            if(!user){
                res.status(401).send({message: "Invalid credentials"});
            };
            if(user){
                user.delete()
                return res.status(200).send({message: req.body.userName + " has been removed"})
            };
        })
    },    
}

