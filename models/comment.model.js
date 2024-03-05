const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')
const {toJSON, paginate} = require('./plugins/')
require('./user.model')

commentSchema = new Schema({
    _id: { type: Number,  min: 1 },
    nftId: {
        type: Number,
        min: [1, "nftId should be equal or greater than 1"],
        validate: {
            validator: function (v) {
                return v >= 1 && Number.isInteger(v);
            },
            message: (props) => `${props.value} should be a positive integer!`,
        }
    },
    parentId: {
        type: Number,
        ref: 'comment'
    },
    content: {
        type: String,
        maxLength: [200, 'content should have at most 200 characters'], 
        required: [true, 'content is required'],
    },
    userId: {
        type: Number,
        min: [1, "userId should be equal or greater than 1"],
        validate: {
            validator: function (v) {
                return v >= 1 && Number.isInteger(v);
            },
            message: (props) => `${props.value} should be a positive integer!`,
        },
        ref: 'User',
        required: [true, 'userId is required'],
    } 
}, 
{ 
    timestamps: true ,
    toJSON: { virtuals: true },
})

commentSchema.plugin(toJSON)
commentSchema.plugin(paginate)

commentSchema.virtual('replies', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'parentId',
})

commentSchema.pre('save', async function (next) {
    if (!this.isNew) {
        next();
        return;
      }
      
      try {
        const seq = await Counter.increment('commentId')
        this._id = seq
        next()
      } catch(err) {
        next(err)
      }   
});

const comment = mongoose.model('comment', commentSchema)

module.exports = comment
