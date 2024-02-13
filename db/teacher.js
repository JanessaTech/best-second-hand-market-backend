const mongoose = require('mongoose')
const { Schema } = mongoose

const initTeacherSchema = (mongoose) => {
    const teacherSchema = new Schema ({
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        major: {
            type: String,
            enum: ['chinese', 'math', 'english'],
            message: '{VALUE} in major not supported'
        }
    })

    return mongoose.model('Teacher', teacherSchema)
}


module.exports = initTeacherSchema