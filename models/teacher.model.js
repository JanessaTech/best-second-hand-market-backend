const mongoose = require('mongoose')
const { Schema } = mongoose

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

const Teacher = mongoose.model('teacher', teacherSchema)

module.exports = Teacher