const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ThreadSchema = new Schema({
    username: {
        type: String,
        required: [true, 'A thread needs to have a username.'],
    },
    title: {
        type: String,
        required: [true, 'A thread needs to have a title.'],
    },
    content: {
        type: String,
        required: [true, 'A thread needs to have content.'],
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment',
        default: [],
        autopopulate: true,
    }],
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
})

// mongoose plugin to always populate fields
// populate can, in stead of retrieve id's of friends, actually retrieve usernames
ThreadSchema.plugin(require('mongoose-autopopulate'));

const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;