const User = require('../models/user.model')
const neo = require('../../neo')

module.exports = {

    async create(req, res, next){

        const userProps = req.body;
        await User.create(userProps)
         .then(user => {
            const session = neo.session()

            session.run(neo.saveUser, {
                username: user.username.toString(),
            })
        
            res.status(201).send(user)
         })
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

                const session = neo.session()

                session.run(neo.deleteUser, {
                    username: user.username.toString(),
                })
            
                return res.status(204).send({message: req.body.username + " has been removed"})
            };
        })
    },    

    async befriendUser(req, res, next){
        const username1 = req.body.username1;
        const username2 = req.body.username2;

        if(username1 == username2){
            res.status(403).send({message: "usernames cannot be the same"});
        } else {
            const user1 = await User.findOne({username: username1})
            const user2 = await User.findOne({username: username2})

            if(user1 != null && user2 != null){

                const session = neo.session();
    
                await session.run(neo.befriend, {
                    username1: username1.toString(),
                    username2: username2.toString()
                })
            
                session.close()
                res.status(200).send({message: "friendhsip initialized"});

            } else {
                res.status(204).send();
            }
        }
    },

    async defriendUser(req, res, next){
        const username1 = req.body.username1;
        const username2 = req.body.username2;

        if(username1 == username2){
            res.status(403).send({message: "usernames cannot be the same"});
        } else {
            const user1 = await User.findOne({username: username1})
            const user2 = await User.findOne({username: username2})

            if(user1 != null && user2 != null){

                const session = neo.session();
    
                await session.run(neo.defriend, {
                    username1: username1.toString(),
                    username2: username2.toString()
                })
            
                session.close()
                res.status(200).send({message: "friendhsip removed"});

            } else {
                res.status(204).send();
            }
        }
    },

    async getRecommendations(req, res, next){
        const session = neo.session()

        r = await session.run(neo.getLikedFromFriends, {
            username: req.body.username.toString()
        })

        res.status(200).send(r);

    }

}
