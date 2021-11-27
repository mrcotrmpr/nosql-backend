const User = require('../models/user.model')

module.exports = {

    async getOne (req, res, next) {
        const entity = await User.findById(req.params.id)
        res.status(200).send(entity)
    },
    
    async getAll(req, res, next){
        const entities = await User.find()
        res.status(200).send(entities)
    }

}

