const yup = require('yup')
const config = require('../../config')

const schemas = {
    mint: yup.object({
        body: yup.object({
            tokenId: yup.number().typeError('tokenId should be an integer equal or greater than 0!').required('tokenId is required').min(0, "tokenId should be equal or greater than 0!").integer('Please enter a valid integer for tokenId!'),
            title: yup.string().min(5, 'Title must have at least 5 characters').max(20, 'Title is less than 20 characters').required('Title is required'),
            category: yup.mixed().oneOf(config.CATEGORIES).required('Category is required'),
            chainId: yup.number().typeError('chainId should be an integer equal or greater than 1!').required('chainId is required').min(1, "chainId should be an integer equal or greater than 1!").integer('Please enter a valid integer for chainId!'),
            status: yup.mixed().oneOf(config.NFTSTATUS).optional(),
            address: yup.string().required('Contract address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'You must provide valid Contract address'),
            description: yup.string().required('NFT description is required').max(200, 'NFT description is less than 200 characters'),
            price: yup.number().typeError('price must be a non negative number').min(0, 'you must privide a non negative number for price').optional(),
        })
    })
}

module.exports = schemas