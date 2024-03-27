const yup = require('yup')
const config = require('../../config/configuration')

const schemas = {
    upload: yup.object({
        body: yup.object({
            title: yup.string().min(5, 'Title must have at least 5 characters').max(20, 'Title is less than 20 characters').required('Title is required'),
            category: yup.mixed().oneOf(Object.values(config.CATEGORIES).map((c) => c.description)).required('Category is required'),
            description: yup.string().required('description is required').max(200, 'description is less than 200 characters'),
        })
    }),
}

module.exports = schemas