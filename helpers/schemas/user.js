const yup = require('yup')

const schemas = {
    register : yup.object({
        body: yup.object({
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).required(),
            roles: yup.array().of(yup.string()).min(1).required("Provide at least one role"),
            age: yup.number().min(18).max(80).optional(),
            email: yup.string().email().optional()
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