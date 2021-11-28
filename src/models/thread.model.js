const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('underscore');

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
})

ThreadSchema.virtual('count_upvotes').get(function () {
    return this.upvotes.length
})

ThreadSchema.virtual('count_downvotes').get(function () {
    return this.downvotes.length
})

// check for unique id's in up- and downvotes
ThreadSchema.pre('save', function (next) {
    this.upvotes = _.uniq(this.upvotes);
    this.downvotes = _.uniq(this.downvotes)
    next();
  });

// mongoose plugin to always populate fields
// populate can, in stead of retrieve id's of comments, actually retrieve comments
ThreadSchema.plugin(require('mongoose-autopopulate'));

// remove all comments on delete
ThreadSchema.pre('remove', function(next) {
    const Comment = mongoose.model('comment')
    Comment.remove({threadId: this._id}).exec();
    next();
})

const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;