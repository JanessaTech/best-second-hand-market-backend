const mongoose = require('mongoose')
const { Schema } = mongoose
const Counter = require('./counter.model')
const config = require('../../config/configuration')

const metadataSchema = new Schema({
    ipnft:{
        type: String,
        required: [true, 'ipnft is required'],
    },
    url: {
        type: String,
        required: [true, 'url is required'],
    },
    data: {
        name : {
            type: String,
            trim: true,
            minLength: [5, 'name should have at least 5 characters'],
            maxLength: [20, 'name should have at most 20 characters'], 
            required: [true, 'name is required'],
        },
        description : {
            type: String,
            maxLength: [200, 'description should have at most 200 characters'], 
            required: [true, 'description is required'],
        },
        image: {
            type: String,
            required: [true, 'image is required'],
        },
        properties: {
            category: {
                type: String,
                enum: Object.values(config.CATEGORIES).map((c) => c.description),
                message: '{VALUE} in category not supported',
                required: [true, 'category is required'],
            }
        }
    }
})
const ipfsSchema = new Schema({
    _id: { type: Number,  min: 1 },
    filename: {
        type: String,
        unique: true,
        index: true,
        required: [true, 'filename is required'],
    },
    metadata: metadataSchema
}, 
{ 
    timestamps: true 
})

ipfsSchema.pre('save', async function (next) {
    if (!this.isNew) {
        next();
        return;
      }
      
      try {
        const seq = await Counter.increment('ipfsId')
        this._id = seq
        next()
      } catch(err) {
        next(err)
      }   
});

const ipfs = mongoose.model('ipfs', ipfsSchema)

module.exports = ipfs

