const toJSON = (schema, options) => {
    // let transform;
    // if (schema.options.toJSON && schema.options.toJSON.transform) {
    //     transform = schema.options.toJSON.transform;
    // }
    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    })
}

module.exports = toJSON