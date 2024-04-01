const mongoose = require('mongoose')
const { Schema } = mongoose
const {toJSON, paginate} = require('../models/plugins')

const nftViewSchema = new Schema({
    _id: Number,
    tokenId: Number,
    chainId: Number,
    address: String,
    uri: String,
    status: String,
    price: Number,
    view: Number,
    createdAt: Date,
    updatedAt: Date,
    title: String,
    description: String,
    category: String
}, { collection: 'nfts_view', versionKey: false })

nftViewSchema.plugin(toJSON)
nftViewSchema.plugin(paginate)

const nftView = mongoose.model('nftView', nftViewSchema)

module.exports = nftView