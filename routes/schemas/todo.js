const yup = require('yup')

const schemas = {
    getAllTodos: yup.object({
        params: yup.object({
            user: yup.number().min(0).required()
        })
    }),
    creatTodo: yup.object({
        body: yup.object({
            user: yup.number().min(0).required(),
            title: yup.string().min(5).max(50).required(),
            body: yup.string().min(3).max(100).required()
        })
    }),
    updateTodo: yup.object({
        body: yup.object({
            user: yup.number().min(0).required(),
            id: yup.number().min(0).required(),
            title: yup.string().min(5).max(50).required(),
            body: yup.string().min(3).max(100).required()
        })
    }),
    deleteTodoById: yup.object({
        params: yup.object({
            user: yup.number().min(0).required(),
            id : yup.number().required()
        })
    })

}

module.exports = schemas