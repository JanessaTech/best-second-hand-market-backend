const yup = require('yup')
const config = require('../../config/configuration')

const schemas = {
    mint: yup.object({
        body: yup.object({
            tokenId: yup.number().typeError('tokenId should be an integer equal to or greater than 0!').required('tokenId is required').min(0, "tokenId should be equal to or greater than 0!").integer('Please enter a valid integer for tokenId!'),
            title: yup.string().min(5, 'Title must have at least 5 characters').max(20, 'Title is less than 20 characters').required('Title is required'),
            category: yup.mixed().oneOf(config.CATEGORIES).required('Category is required'),
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').required('chainId is required').min(1, "chainId should be an integer equal to or greater than 1!").integer('Please enter a valid integer for chainId!'),
            status: yup.mixed().oneOf(config.NFTSTATUS).optional(),
            address: yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'You must provide valid address'),
            description: yup.string().required('description is required').max(200, 'description is less than 200 characters'),
            price: yup.number().typeError('price must be a non negative number').min(0, 'you must privide a non negative number for price').optional(),
        })
    }),
    update: yup.object({
        body: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').required('id is required').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!'),
            price:  yup.number().typeError('price must be a non negative number').min(0, 'you must privide a non negative number for price').optional(),
            status: yup.mixed().oneOf(config.NFTSTATUS).optional(),
        })
    }),
    queryNftsForUser: yup.object({
        params: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required'),
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            limit: yup.number().min(1, 'limit should be equal to or greater than 1!').max(100, 'limit can not be greater than 100').integer('Please enter a valid integer for page!').optional(),
            sortBy: yup.string().optional()
        })
    }),
    getNftById: yup.object({
        params: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required')
        }) 
    }),
    queryNFTs: yup.object({
        query: yup.object({
            userId: yup.number().min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').optional(),
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            limit: yup.number().min(1, 'limit should be equal to or greater than 1!').max(100, 'limit can not be greater than 100').integer('Please enter a valid integer for page!').optional(),
            sortBy: yup.string().optional()
        })
    })
}

module.exports = schemas