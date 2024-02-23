const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')

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
    title: {
        type: String,
        trim: true,
        minLength: [5, 'title should have at least 5 characters'],
        maxLength: [20, 'title should have at most 20 characters'], 
        required: [true, 'title is required'],
    },
    category: {
        type: String,
        enum: ['pets', 'clothes', 'cosmetics', 'outfits', 'car', 'devices', 'books'],
        message: '{VALUE} in category not supported',
        required: [true, 'category is required'],
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
    description: {
        type: String,
        maxLength: [200, 'description should have at most 200 characters'], 
        required: [true, 'description is required'],
    },
    status: {
        type: String,
        enum: ['on', 'off'],
        default: 'off', 
        message: '{VALUE} in status not supported',
        required: [true, 'status is required'],
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'price can not be a negative number'],
    }
}, { timestamps: true })

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

