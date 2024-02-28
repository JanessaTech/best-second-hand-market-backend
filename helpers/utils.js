const config = require('../config')
const logger = require('../helpers/logger')

const convertToURL = (ipfs) => {
    const cid = ipfs.substring('ipfs://'.length)
    const [protocol, domain] = config.gateway.split('://')
    const url = `${protocol}://${cid}.ipfs.${domain}`
    logger.debug(`ipfs = ${ipfs} to url = ${url}`)
    return url
}

module.exports = {convertToURL}

