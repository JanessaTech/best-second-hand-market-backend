const mongoose = require('../db')
const { Schema } = mongoose

const studentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    age: {
        type: Number,
        min: 6, max: 12,
        message: '{VALUE} in age is not supported'
    },
    grade: {
        type: Number,
        min: 1, max: 6,
        message: '{VALUE} in grade is not supported'
    },
    teachers : [{
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }]
})

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

const Student = mongoose.model('Student', studentSchema)
const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = {Student, Teacher}