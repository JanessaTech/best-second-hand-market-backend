const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')
const {toJSON, paginate} = require('./plugins/')
require('./user.model')

const cartSchema = new Schema({
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

cartSchema.plugin(toJSON)
cartSchema.plugin(paginate)

cartSchema.index({userId: 1, nftId: 1},{unique: true})

cartSchema.pre('save', async function (next) {
    if (!this.isNew) {
        next();
        return;
      }
      
      try {
        const seq = await Counter.increment('cartId')
        this._id = seq
        next()
      } catch(err) {
        next(err)
      }   
});

const cart = mongoose.model('cart', cartSchema)

module.exports = cart

