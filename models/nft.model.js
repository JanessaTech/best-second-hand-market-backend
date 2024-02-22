const mongoose = require('mongoose')
const { Schema } = mongoose

const nftSchema = new Schema({})

const NFT = mongoose.model('nft', nftSchema)

module.exports = NFT

