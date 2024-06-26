const yup = require('yup')
const config = require('../../config/configuration')
const {getAttrs} = require('../../db/utils')
const {NFT} = require('../../db/models')
const {NftView} = require('../../db/views')

const schemas = {
    mint: yup.object({
        body: yup.object({
            tokenId: yup.number().typeError('tokenId should be an integer equal to or greater than 0!').required('tokenId is required').min(0, "tokenId should be equal to or greater than 0!").integer('Please enter a valid integer for tokenId!'),
            ipfs: yup.string().required('ipfs is required').matches(/^ipfs:\/\/(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})\/product__[0-9]{13}.(jpg|jpeg|png|gif)$/, 'You must provide valid IPFS URL'),
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').required('chainId is required').min(1, "chainId should be an integer equal to or greater than 1!").integer('Please enter a valid integer for chainId!'),
            status: yup.mixed().oneOf(Object.values(config.NFTSTATUS).map((s) => s.description)).optional(),
            address: yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'You must provide valid address'),
            price: yup.number().typeError('price must be a non negative number').min(0, 'you must privide a non negative number for price').optional(),
        })
    }),
    update: yup.object({
        body: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').required('id is required').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!'),
            price:  yup.number().typeError('price must be a non negative number').min(0, 'you must privide a non negative number for price').optional(),
            status: yup.mixed().oneOf(Object.values(config.NFTSTATUS).map((s) => s.description)).optional(),
        })
    }),
    queryNFTsForUser: yup.object({
        params: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required')
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
                        message: `sortBy is a comma delimited list in which each item should follow the format: attr:(asc|desc). attr is one of (${getAttrs(NftView)}). eg: ${getAttrs(NftView)[0]}:asc,${getAttrs(NftView)[1]}:desc`,
                        test: sortBy => {
                            if (sortBy) {
                                const sortOptions = sortBy.split(',')
                                for (const sortOption of sortOptions) {
                                    const [key, order] = sortOption.split(':')
                                    if (!order) {
                                        return false
                                    }
                                    if (!getAttrs(NftView).includes(key)) {
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
    }),
    queryFavoriteNFTsForUser: yup.object({
        params: yup.object({
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required')
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
                        message: `sortBy is a comma delimited list in which each item should follow the format: attr:(asc|desc). attr is one of (${getAttrs(NftView)}). eg: ${getAttrs(NftView)[0]}:asc,${getAttrs(NftView)[1]}:desc`,
                        test: sortBy => {
                            if (sortBy) {
                                const sortOptions = sortBy.split(',')
                                for (const sortOption of sortOptions) {
                                    const [key, order] = sortOption.split(':')
                                    if (!order) {
                                        return false
                                    }
                                    if (!getAttrs(NftView).includes(key)) {
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
    }),
    findNFTById: yup.object({
        params: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required')
        }),
        query:  yup.object({
            userId: yup.number().min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').optional(),
        })
    }),
    queryNFTs: yup.object({
        query: yup.object({
            userId: yup.number().min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').optional(),
            category: yup.array().optional()
                      .of(yup.string().oneOf(Object.values(config.CATEGORIES).map((c) => c.description))),
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, "chainId should be an integer equal to or greater than 1!").integer('Please enter a valid integer for chainId!').optional(),
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
                        message: `sortBy is a comma delimited list in which each item should follow the format: attr:(asc|desc). attr is one of (${getAttrs(NftView)}). eg: ${getAttrs(NftView)[0]}:asc,${getAttrs(NftView)[1]}:desc`,
                        test: sortBy => {
                            if (sortBy) {
                                const sortOptions = sortBy.split(',')
                                for (const sortOption of sortOptions) {
                                    const [key, order] = sortOption.split(':')
                                    if (!order) {
                                        return false
                                    }
                                    if (!getAttrs(NftView).includes(key)) {
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