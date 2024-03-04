const yup = require('yup')

const schemas = {
    addComment: yup.object({
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
            userId: yup.number().typeError('userId should be an integer equal to or greater than 1!').min(1, 'userId should be equal to or greater than 1!').integer('Please enter a valid integer for userId!').required('userId is required')
        }, ['parentId', 'nftId'])
    }),
    deleteComment: yup.object({
        params: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required')
        })
    }),
    queryCommentsByNftId:yup.object({
        params: yup.object({
            nftId: yup.number().typeError('nftId should be an integer equal to or greater than 1!').min(1, 'nftId should be equal to or greater than 1!').integer('Please enter a valid integer for nftId!').required('nftId is required')
        })
    })
}

module.exports = schemas