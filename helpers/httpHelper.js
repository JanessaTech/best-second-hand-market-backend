const urls = require('../config/urls')
const config = require('../config/configuration')
const logger = require('../helpers/logger')
const axios = require('axios')
const messageHelper = require('../helpers/internationaliztion/messageHelper')

function getRoles(originalUrl) {
    for(let prop in urls) {
        let key = prop
        let value = urls[key]
        let matched = originalUrl.match(key)
        if (matched) return value
    }
    return []
}

function getQueryObject({page, limit, sortBy, chainId, status, category, prices, title}) {
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
    if (title) {
        query.title = title 
    }
    return query
}

const convertToURL = (ipfs) => {
    const cid = ipfs.substring('ipfs://'.length, ipfs.indexOf('/product'))
    const filename = ipfs.substring(ipfs.indexOf('product'))
    const [protocol, domain] = config.gateway.split('://')
    const url = `${protocol}://${cid}.ipfs.${domain}/${filename}`
    logger.debug(`ipfs = ${ipfs} to url = ${url}`)
    return url
}

/*
const getImageIPFSByMetaData = async (metadata) => {
    if (metadata?.url) throw new Error('Invalid metadata: no url')
    //const regex = /^ipfs:\/\/(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})\/metadata\.json$/
    const ok = config.nft_storage.metadata.regex.test(metadata.url)
    if (!ok) throw new Error('Invalid metadata: url format is invalid')
    const end = metadata.url.indexOf('metadata.json') - 1
    const cid = metadata.url.substring('ipfs://'.length, end)
    logger.debug('[getImageIPFSByMetaData] cid =', cid)
    const gateway = config.nft_storage.gateway
    const [protocol, domain] = gateway.split('://')
    const url = `${protocol}://${cid}.ipfs.${domain}/metadata.json`
    logger.debug('[getImageIPFSByMetaData] url =', url)
    const data = await getResponseData(url)
    return data
}*/

const getResponseData = async (url) => {
    try {
        const response = await axios.get(url)
        return response?.data
    } catch (err) {
        const errMsg = messageHelper.getMessage('httpHelper_failed_getData', url, err)
        logger.error(errMsg)
        throw new Error(errMsg)
    }
}


module.exports = {
    getRoles, getQueryObject, convertToURL, getResponseData
}