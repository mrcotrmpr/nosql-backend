const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'A user needs to have a username.'],
        unique: [true, 'A user needs to have a unique username'],
    },
    password: {
        type: String,
        required: [true, 'A user needs to have a password.'],
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: [],
        autopopulate: true,
    }],
})

// mongoose plugin to always populate fields
// populate can, in stead of retrieve id's of friends, actually retrieve usernames
UserSchema.plugin(require('mongoose-autopopulate'));

const User = mongoose.model('user', UserSchema);

module.exports = User;