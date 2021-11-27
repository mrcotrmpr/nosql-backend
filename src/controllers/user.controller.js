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
        const entity = await User.findById(req.params.id)
        res.status(200).send(entity)
    },
    
    async getAll(req, res, next){
        const entities = await User.find()
        res.status(200).send(entities)
    }

}

