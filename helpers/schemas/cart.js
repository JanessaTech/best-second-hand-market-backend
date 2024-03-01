const yup = require('yup')

const schemas = {
    add: yup.object({
        body: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            nftId: yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required('nftId is required')
        })
    }),
    remove: yup.object({
        params: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required')
        })
    }),
    queryByUser: yup.object({
        params: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            limit: yup.number().min(1, 'limit should be equal to or greater than 1!').max(100, 'limit can not be greater than 100').integer('Please enter a valid integer for page!').optional(),
            sortBy: yup.string().optional()
        })
    })
}

module.exports = schemas