const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')
const {toJSON, paginate} = require('./plugins/')
require('./user.model')
const logger = require('../helpers/logger')

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
    user: {
        type: Number,
        min: [1, "user should be equal or greater than 1"],
        validate: {
            validator: function (v) {
                return v >= 1 && Number.isInteger(v);
            },
            message: (props) => `${props.value} should be a positive integer!`,
        },
        ref: 'User',
        required: [true, 'user is required'],
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
    options: { sort: { 'createdAt': -1}},
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
})

commentSchema.pre('findOneAndDelete', async function(next) {
    logger.debug('findOneAndDelete is triggered. this.getQuery()._id=', this.getQuery()._id)
    const toDelete = await this.model.findOne(this.getQuery())
    try {
        const result = await this.model.deleteMany({'parentId': toDelete._id})
        logger.debug(`Deleted ${result?.deletedCount} comments where parentId = ${toDelete._id}`)
        next()
    } catch(err) {
        next(err)
    }
})


const comment = mongoose.model('comment', commentSchema)

module.exports = comment
