const mongoose = require('mongoose')
const { Schema } = mongoose
const {toJSON, paginate} = require('../models/plugins')
require('../models/user.model')

const fullOrderViewSchema = new Schema({
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
}, { collection: 'full_order_view', versionKey: false })

fullOrderViewSchema.plugin(toJSON)
fullOrderViewSchema.plugin(paginate)

const fullOrderView = mongoose.model('fullOrderView', fullOrderViewSchema)

module.exports = fullOrderView