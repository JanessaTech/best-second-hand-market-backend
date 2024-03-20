const logger = require('../helpers/logger')
const mongoose = require('mongoose')

const getAttrs = (model) => {
    logger.debug('models.utils.getAttrs. Get attributes for model', model.modelName)
    let props = Object.keys(model.schema.paths)
    //props = props.filter((attr) => attr !== '__v').map((attr) => (attr === '_id') ? 'id' : attr)
    props = props.filter((attr) => attr !== '__v')
    props.push('id')  // by defaut, we added replace _id with in toJSON plugin
    logger.debug('models.utils.getAttrs. The attributes are:', props)
    return props  
}

const getRefs = (model) => {
    logger.debug('models.utils.getRefs. Get refs for model', model.modelName)
    const virtualKeys = Object.keys(model.schema.virtuals).filter((key) => key !== 'id')  // ignore id
    logger.debug('models.utils.getRefs. The keys for virtual:', virtualKeys)
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
        }
    }
    logger.debug('models.utils.getRefs. refs = ', refs)
    return refs
}

const getAttrsByModelName = (name) => {
    logger.debug('models.utils.getAttrsByModelName. Get attributes for model', name)
    const model = mongoose.model(name)
    let props = Object.keys(model.schema.paths)
    props = props.filter((attr) => attr !== '__v').map((attr) => (attr === '_id') ? 'id' : attr) 
    logger.debug('models.utils.getAttrsByModelName. The attributes are:', props)
    return props 
}

module.exports = {
    getAttrs, getRefs, getAttrsByModelName
}