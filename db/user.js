const mongoose = require('mongoose')
const { Schema } = mongoose
const initCounterSchema = require('./counter')

const initUserSchema = (mongoose) => {
    const userSchema = new Schema({
        id: { type: Number,  unique: true, index: true, min: 1 },
        name: {
            type: String,
            trim: true,
            unique: true,
            minLength: [5, 'name should have at least 5 characters'],
            maxLength: [20, 'name should have at most 20 characters'], 
            required: [true, 'name is required'],
        },
        address: {
            type: String,
            index: true,
            trim: true,
            unique: true,
            validate: {
                validator: function(v) {
                    var re = /^0x[a-fA-F0-9]{40}$/;
                    return re.test(v)
                },
                message: props => `${props.value} is invalid cryptocurrency wallet address`
            },
            required: [true, 'address is invalid'],
        },
        intro: {
            type: String,
            trim: true,
            maxLength: [200, 'intro should be less than 200 characters']
        },
        loginTime: {type: Date},
        logoutTime: {type: Date},
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


