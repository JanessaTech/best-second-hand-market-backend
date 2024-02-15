const mongoose = require('mongoose')
const { Schema } = mongoose
const initCounterSchema = require('./counter')

const initUserSchema = (mongoose) => {
    const userSchema = new Schema({
        id: { type: Number,  unique: true, index: true, min: 1 },
        name: {
            type: String,
            required: [true, 'name is required'],
        },
        address: {
            type: String,
            required: [true, 'address is required'],
        },
        intro: String
    }, { timestamps: true })

    const CounterModel = initCounterSchema(mongoose)

    userSchema.pre('save', async function (next) {
        if (!this.isNew) {
          next();
          return;
        }
        
        try {
          const seq = await CounterModel.increment('userId')
          this.id = seq
          next()
        } catch(err) {
          next(err)
        }   
    });
    return mongoose.model('User', userSchema)
}

module.exports = initUserSchema


