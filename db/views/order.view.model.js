const mongoose = require('mongoose')
const { Schema } = mongoose
const {toJSON, paginate} = require('../models/plugins')
require('../models/user.model')

const orderViewSchema = new Schema({
    _id: Number,
    user: {
        type: Number,
        ref: 'User'
    },
    nftId: Number,
    price: Number,
    from: String,
    createdAt: Date,
    tokenId: Number,
    title: String,
    category: String,
    chainId: Number,
    address: String,
    description: String,
    status: String,
    view: Number
}, { collection: 'orders_view', versionKey: false })

orderViewSchema.plugin(toJSON)
orderViewSchema.plugin(paginate)

const orderView = mongoose.model('orderView', orderViewSchema)

module.exports = orderView