const yup = require('yup')

const schemas = {
    update: yup.object({
        body: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            value: yup.number().typeError('value should be greater than 0!').moreThan(0, 'value should be greater than 0!').required('value is required')
        })
    }),
    queryByUserId:yup.object({
        params:  yup.object({
            userId: yup.number().min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
        })
    })
}

module.exports = schemas