const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')
const {toJSON} = require('./plugins/')
require('./user.model')

const likeSchema = new Schema({
    _id: { type: Number,  min: 1 },
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
    },
    nftId: {
        type: Number,
        min: [1, "nftId should be equal or greater than 1"],
        validate: {
            validator: function (v) {
                return v >= 1 && Number.isInteger(v);
            },
            message: (props) => `${props.value} should be a positive integer!`,
        },
        required: [true, 'nftId is required'],
    }
}, 
{ 
    timestamps: true 
})

likeSchema.plugin(toJSON)
likeSchema.index({userId: 1, nftId: 1},{unique: true})

likeSchema.pre('save', async function (next) {
    if (!this.isNew) {
        next();
        return;
      }
      
      try {
        const seq = await Counter.increment('likeId')
        this._id = seq
        next()
      } catch(err) {
        next(err)
      }   
});

const like = mongoose.model('like', likeSchema)

module.exports = like