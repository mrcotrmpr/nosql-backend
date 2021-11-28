const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubcommentSchema = new Schema({
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
        required: [true, 'A subcomment needs a valid comment id']
    },
    username: {
        type: String,
        required: [true, 'A subcomment needs to have a username.'],
    },
    content: {
        type: String,
        required: [true, 'A subcomment needs to have content.'],
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
})

// mongoose plugin to always populate fields
// populate can, in stead of retrieve id's of subcomments, actually retrieve subcomments
SubcommentSchema.plugin(require('mongoose-autopopulate'));

SubcommentSchema.virtual('count_upvotes').get(function () {
    return this.upvotes.length
})

SubcommentSchema.virtual('count_downvotes').get(function () {
    return this.downvotes.length
})

const Subcomment = mongoose.model('subcomment', SubcommentSchema);

module.exports = Subcomment;