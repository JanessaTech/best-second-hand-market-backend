const yup = require('yup')

const schemas = {
    register : yup.object({
        body: yup.object({
            name : yup.string().min(5, 'name must have at least 5 characters').max(20, 'name must have at most 20 characters').required('name is required'),
            address: yup.string().required('address is required').matches(/^0x[a-fA-F0-9]{40}$/, 'address is invalid cryptocurrency wallet address'),
            intro: yup.string().max(200, 'intro should be less than 200 characters').optional(),
            gateway: yup.string().required('gateway is required')
        })
    }),
    login : yup.object({
        body: yup.object({
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).required()
        })
    }),
    getByUserId :yup.object({
        params: yup.object({
            id : yup.number().required()
        })
    }),
    updateUser: yup.object({
        body: yup.object({
            id : yup.number().required(),
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).optional(),
            age: yup.number().min(18).max(80).optional(),
            email: yup.string().email().optional()
        })
    }),




}

module.exports = schemas