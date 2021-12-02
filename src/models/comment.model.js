const mongoose = require('mongoose')
const Schema = mongoose.Schema

const opts = { toJSON: { virtuals: true, transform: function (doc, ret) { delete ret.id }}};
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
        ref: 'subcomment',
        default: [],
        autopopulate: true,
    }],
    upvotes: [{
        type: Schema.Types.String,
        ref: 'user',
        default: []
    }],
    downvotes: [{
        type: Schema.Types.String,
        ref: 'user',
        default: []
        }]
}, opts)

// mongoose plugin to always populate fields
// populate can, in stead of retrieve id's of subcomments, actually retrieve subcomments
CommentSchema.plugin(require('mongoose-autopopulate'));

// remove all subcomments on delete
CommentSchema.pre('remove', function(next) {
    const Subcomment = mongoose.model('subcomment')
    Subcomment.remove({commentId: this._id}).exec();
    next();
})

CommentSchema.virtual('count_upvotes').get(function () {
    return this.upvotes.length
})

CommentSchema.virtual('count_downvotes').get(function () {
    return this.downvotes.length
})

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;