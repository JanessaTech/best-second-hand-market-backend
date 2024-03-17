const urls = require('../config/urls')

function getRoles(originalUrl) {
    for(let prop in urls) {
        let key = prop
        let value = urls[key]
        let matched = originalUrl.match(key)
        if (matched) return value
    }
    return []
}

function getQueryObject(page, limit, sortBy, chainId, category, prices) {
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
    if (category) {
        query.category = category
    }
    if (prices) {
        query.prices = prices
    }
    return query
}


module.exports = {
    getRoles, getQueryObject
}