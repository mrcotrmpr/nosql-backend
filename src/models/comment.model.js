const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    threadId: {
        type: Schema.Types.ObjectId,
        ref: 'thread',
        required: [true, 'A comment needs a valid thread id']
    },
    username: {
        type: String,
        required: [true, 'A comment needs to have a username.'],
    },
    content: {
        type: String,
        required: [true, 'A comment needs to have content.'],
    },
    subcomments: [{
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
CommentSchema.plugin(require('mongoose-autopopulate'));

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;