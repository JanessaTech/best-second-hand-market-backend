const mongoose = require('mongoose')
const { Schema } = mongoose

const initCounterSchema = (mongoose) => {
    const counterSchema = new Schema(
        {
        _id: {type: String},
        seq: { type: Number, default: 0 }
        }
    )
    counterSchema.static('increment',  async function(counterName) {
        const counter = await this.findByIdAndUpdate({_id: counterName}, { $inc: { seq: 1 } },{ new: true, upsert: true })
        return counter.seq
    })

    return mongoose.model('counter', counterSchema)
}

module.exports = initCounterSchema