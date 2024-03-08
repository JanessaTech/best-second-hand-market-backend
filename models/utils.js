
const getAttrs = (model) => {
    const props = Object.keys(model.schema.paths);
    return props.filter((attr) => attr !== '__v')
}

module.exports = {
    getAttrs
}