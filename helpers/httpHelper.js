const urls = require('../config/urls')
const config = require('../config/configuration')
const logger = require('../helpers/logger')

function getRoles(originalUrl) {
    for(let prop in urls) {
        let key = prop
        let value = urls[key]
        let matched = originalUrl.match(key)
        if (matched) return value
    }
    return []
}

function getQueryObject({page, limit, sortBy, chainId, status, category, prices}) {
    const query = {}
    if (page) {
        query.page = Number(page)
    }
    if (limit) {
        query.limit = Number(limit)
    }
    if (sortBy) {
        query.sortBy = sortBy
    }
    if (chainId) {
        query.chainId = Number(chainId)
    }
    if (status) {
        query.status = status
    }
    if (category) {
        query.category = category
    }
    if (prices) {
        query.prices = prices
    }
    return query
}

const convertToURL = (ipfs) => {
    const cid = ipfs.substring('ipfs://'.length)
    const [protocol, domain] = config.gateway.split('://')
    const url = `${protocol}://${cid}.ipfs.${domain}`
    logger.debug(`ipfs = ${ipfs} to url = ${url}`)
    return url
}


module.exports = {
    getRoles, getQueryObject, convertToURL
}