const yup = require('yup')

const schemas = {
    create: yup.object({
        body: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            nftId: yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required('nftId is required'),
            from: yup.string().required('from is required').matches(/^0x[a-fA-F0-9]{40}$/, 'You must provide valid address for from'),
        })
    }),
    createInBatch: yup.object({
        body: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            nftIds: yup.array().required('You must provide the array nftIds')
                    .of(yup.number().typeError('nftIds should contain the value which is an integer equal to or greater than 1!').min(1, 'The value in the array nftIds should be equal to or greater than 1!').integer('Please enter a valid integer for the value in nftIds!'))
                    .test({
                        message: 'nftIds should be provided and contains at least one value', 
                        test:arr =>  arr.length > 0}),
            froms: yup.array().required('You must provide the array froms')
                    .of(yup.string().matches(/^0x[a-fA-F0-9]{40}$/, 'You must provide valid address for the value in the array froms'))
                    .test({
                        message: 'froms array should be provided and contains at least one value', 
                        test:arr => arr.length > 0})
        })
        
    }),
    queryOrdersByUserId: yup.object({
        params: yup.object({
            userId: yup.number().min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').optional(),
        }),
        query: yup.object({
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            limit: yup.number().min(1, 'limit should be equal to or greater than 1!').max(100, 'limit can not be greater than 100').integer('Please enter a valid integer for page!').optional(),
            sortBy: yup.string().optional()
        })
    })
}

module.exports = schemas