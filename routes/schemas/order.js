const yup = require('yup')
const {OrderView} = require('../../db/views')
const config = require('../../config/configuration')
const {getAttrs} = require('../../db/utils')

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
            category: yup.array().optional()
                      .of(yup.string().oneOf(Object.values(config.CATEGORIES).map((c) => c.description))),
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, "chainId should be an integer equal to or greater than 1!").integer('Please enter a valid integer for chainId!').optional(),
            status: yup.mixed().oneOf(Object.values(config.NFTSTATUS).map((s) => s.description)).optional(),
            prices: yup.string().optional()
                    .test({
                        name: 'validation for max and min',
                        message: 'The prices should follow the format as like: min:2|max:20',
                        test: prices => {
                            if (prices) {
                                const regex = /^min:\d+\|max:\d+$/
                                return regex.test(prices)
                            }
                            return true
                        }
                    })
                    .test({
                        name: 'validation for max and min',
                        message: 'The max value should be greater than the min value',
                        test: prices => {
                            if (prices) {
                                const [minPart, maxPart] = prices.split('|')
                                const [, min] = minPart.split(':')
                                const [, max] = maxPart.split(':')
                                return Number(min) < Number(max)
                            }
                            return true
                        }
                    }),
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            limit: yup.number().min(1, 'limit should be equal to or greater than 1!').max(100, 'limit can not be greater than 100').integer('Please enter a valid integer for page!').optional(),
            sortBy: yup.string().optional()
                    .test({
                        name: 'validation for sortBy',
                        message: `sortBy is a comma delimited list in which each item should follow the format: attr:(asc|desc). attr is one of (${getAttrs(OrderView)}). eg: ${getAttrs(OrderView)[0]}:asc,${getAttrs(OrderView)[1]}:desc`,
                        test: sortBy => {
                            if (sortBy) {
                                const sortOptions = sortBy.split(',')
                                for (const sortOption of sortOptions) {
                                    const [key, order] = sortOption.split(':')
                                    if (!order) {
                                        return false
                                    }
                                    if (!getAttrs(OrderView).includes(key)) {
                                        return false
                                    }
                                    if (!['asc', 'desc'].includes(order)) {
                                        return false
                                    }
                                }
                            }
                            return true
                        }
                    })
        })
    })
}

module.exports = schemas