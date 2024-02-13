const mongoose = require('mongoose')
const { Schema } = mongoose

const initUserSchema = (mongoose) => {
    const userSchema = new Schema({
        name: {
            type: String,
            required: [true, 'name is required'],
        },
        address: {
            type: String,
            required: [true, 'address is required'],
        },
        intro: String
    })
    return mongoose.model('User', userSchema)
}

module.exports = initUserSchema


