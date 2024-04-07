const config = require('../config/configuration')
const messageHelper = require('../helpers/internationaliztion/messageHelper')

const getExchange = (chainId) => {
    logger.debug(`getExchange. config.env: ${config.env}`)
    const chains = config.chains[config.env]
    const chain = chains.find((c) => c.chainId === chainId)
    if (!chain) {
        throw new Error(messageHelper.getMessage('chainHelper_chain_not_found', chainId))
    }
}

module.exports = {getExchange}