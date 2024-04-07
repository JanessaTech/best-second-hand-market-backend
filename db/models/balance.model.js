const mongoose = require('mongoose')
const { Schema } = mongoose
const {toJSON} = require('./plugins/')
require('./user.model')

const balanceSchema =  new Schema({
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
    value: {
        type: Number,
        default: 0,
        min: [0, 'price can not be a negative number'],
    }
}, 
{ 
    timestamps: true 
})

balanceSchema.plugin(toJSON)

balanceSchema.index({userId: 1},{unique: true})

const balance = mongoose.model('balance', balanceSchema)

module.exports = balance