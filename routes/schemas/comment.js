const yup = require('yup')

const schemas = {
    create: yup.object({
        body: yup.object().shape({
            nftId: yup.number().when('parentId', {
                is: (parentId) => !parentId,
                then: () => yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required(),
                otherwise: () => yup.number()
            }),
            parentId: yup.number().when('nftId', {
                is: (nftId) => !nftId,
                then: () => yup.number().typeError('parentId should be an integer equal to or greater than 1!').min(1, 'parentId should be equal to or greater than 1!').integer('Please enter a valid integer for parentId!').required(),
                otherwise: () => yup.number()
            }),
            content: yup.string().max(200, 'intro should be less than 200 characters').required("You must provide content"),
            user: yup.number().typeError('user should be an integer equal to or greater than 1!').min(1, 'user should be equal to or greater than 1!').integer('Please enter a valid integer for user!').required('user is required')
        }, ['parentId', 'nftId'])
    }),
    delete: yup.object({
        params: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required')
        })
    }),
    queryCommentsByNftId:yup.object({
        params: yup.object({
            nftId: yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required('nftId is required')
        }),
        query: yup.object({
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            limit: yup.number().min(1, 'limit should be equal to or greater than 1!').max(100, 'limit can not be greater than 100').integer('Please enter a valid integer for page!').optional(),
            sortBy: yup.string().optional()
        })
    })
}

module.exports = schemas