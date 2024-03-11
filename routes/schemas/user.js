const yup = require('yup')

const schemas = {
    register : yup.object({
        body: yup.object({
            name : yup.string().min(5, 'name must have at least 5 characters').max(20, 'name must have at most 20 characters').required('name is required'),
            address: yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'address is invalid cryptocurrency wallet address'),
            intro: yup.string().max(200, 'intro should be less than 200 characters').optional()
        })
    }),
    loginByAddress: yup.object({
        body: yup.object({
            address: yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'address is invalid cryptocurrency wallet address'),
        }) 
    }),
    logoutByAddress: yup.object({
        body: yup.object({
            address: yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'address is invalid cryptocurrency wallet address'),
        }) 
    }),
    update : yup.object({
        body: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required'),
            name : yup.string().min(5, 'name must have at least 5 characters').max(20, 'name must have at most 20 characters').optional(),
            intro: yup.string().max(200, 'intro should be less than 200 characters').optional()
        })
    }),
    findUserByAddress: yup.object({
        params: yup.object({
            address : yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'address is invalid cryptocurrency wallet address')
        })
    }),
    getOverViewById: yup.object({
        params: yup.object({
            id: yup.number().typeError('id should be an integer equal to or greater than 1!').min(1, 'id should be equal to or greater than 1!').integer('Please enter a valid integer for id!').required('id is required'),
        })
    }),
    uploadFile: yup.object({
        body: yup.object({
            name: yup.string().min(5, 'name should have at least 5 characters').required('name is required')
        })
    })

}

module.exports = schemas