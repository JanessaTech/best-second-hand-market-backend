const logger = require('../helpers/logger')

const getAttrs = (model) => {
    logger.debug('models.utils. Get attributes for model', model.modelName)
    const props = Object.keys(model.schema.paths);
    logger.debug('models.utils. The attributes are:', props)
    return props.filter((attr) => attr !== '__v')
}

const getRefs = (model) => {
    logger.debug('models.utils. Get refs for model', model.modelName)
    const virtualKeys = Object.keys(model.schema.virtuals).filter((key) => key !== 'id')  // ignore id
    logger.debug('models.utils. The keys for virtual:', virtualKeys)
    const refs = []
    for( const virtualKey of virtualKeys) {
        if(model.schema.virtuals[virtualKey]?.options?.ref) {
            refs.push({attr: virtualKey, ref: model.schema.virtuals[virtualKey]?.options?.ref})
        }
        
    }
    const props = Object.keys(model.schema.paths);
   
    for (const prop of props) {
        if (model.schema.paths[prop]?.options?.ref) {
            refs.push({attr: prop, ref: model.schema.paths[prop]?.options?.ref})
            //refs.push(model.schema.paths[prop]?.options?.ref)
        }
    }
    return refs
}

module.exports = {
    getAttrs, getRefs
}