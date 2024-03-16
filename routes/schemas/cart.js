const yup = require('yup')

const schemas = {
    add: yup.object({
        body: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            nftId: yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required('nftId is required')
        })
    }),
    remove: yup.object({
        query: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            nftId: yup.array().required('You must provide the array nftId')
                    .of(yup.number().typeError('nftId should contain the value which is an integer equal to or greater than 1!').min(1, 'The value in the array nftId should be equal to or greater than 1!').integer('Please enter a valid integer for the value in nftId!'))
                    .test({
                        message: 'nftId should be provided and contains at least one value', 
                        test:arr =>  arr.length > 0}),
        })
    }),
    isInCart: yup.object({
        query: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            nftId: yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required('nftId is required')
        })
    }),
    queryByUser: yup.object({
        params: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required')
        })
    })
}

module.exports = schemas