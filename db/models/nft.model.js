const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')
const {toJSON, paginate} = require('./plugins/')
const config = require('../../config/configuration')
const logger = require('../../helpers/logger')
require('./ipfs.model')

const nftSchema = new Schema({
    _id: { type: Number,  min: 1 },
    tokenId: {
        type: Number,
        validate: {
            validator: function (v) {
                return v >= 0 && Number.isInteger(v);
            },
            message: (props) => `${props.value} should be a integer equal or greater than 0!`,
        },
        required: [true, 'tokenId is required'],
    },
    ipfs: {
        type: Number,
        required: [true, 'ipfs is required'],
        ref: 'ipfs',
    },
    chainId: {
        type: Number,
        min: [1, "chainId should be equal or greater than 1"],
        validate: {
            validator: function (v) {
                return v >= 1 && Number.isInteger(v);
            },
            message: (props) => `${props.value} should be a positive integer!`,
        },
        required: [true, 'chainId is required'],
    },
    address: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                var re = /^0x[a-fA-F0-9]{40}$/;
                return re.test(v)
            },
            message: props => `${props.value} is invalid cryptocurrency contract address`
        },
        required: [true, 'address is invalid'],
    },
    status: {
        type: String,
        enum: Object.values(config.NFTSTATUS).map((s) => s.description),
        default: config.NFTSTATUS.Off.description, 
        message: '{VALUE} in status not supported',
        required: [true, 'status is required'],
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'price can not be a negative number'],
    },
    view: {
        type: Number,
        default: 0,
    }
}, 
{ 
    timestamps: true 
})

nftSchema.plugin(toJSON)
nftSchema.plugin(paginate)

nftSchema.index({chainId: 1, address: 1, tokenId: 1},{unique: true})

nftSchema.pre('save', async function (next) {
    if (!this.isNew) {
        next();
        return;
      }
      
      try {
        const seq = await Counter.increment('nftId')
        this._id = seq
        next()
      } catch(err) {
        next(err)
      }   
});

const NFT = mongoose.model('nft', nftSchema)

module.exports = NFT

