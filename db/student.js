const mongoose = require('mongoose')
const { Schema } = mongoose
const initTeacherSchema = require('./teacher')

const initStudentSchema = (mongoose) => {
    initTeacherSchema(mongoose)

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

    return mongoose.model('Student', studentSchema)

}
    

module.exports = initStudentSchema