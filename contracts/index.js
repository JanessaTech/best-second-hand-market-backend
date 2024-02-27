const config = require('../config')
const logger = require('../helpers/logger')
const {ethers} = require('ethers')
const Chain = require('../contracts/chain')
const Contract = require('../contracts/contract')

const createChains = (env) => {
    logger.info('Create chains for env', env)
    let chains = new Map()
    const cfgs = config.chains[env]
    if (!cfgs) {
        logger.error('Can not find config.chains by env', env, '. Please check the correctness of config.chains in config.common.js')
        process.exit()
    }
    cfgs.filter((cfg) => cfg.enabled).forEach((cfg, index) => {
        logger.debug("cfg at index", index)
        const chainId = cfg.chainId
        const enabled = cfg.enabled
        const chainName = cfg.chainName
        const currency = cfg.currency
        const rpcUrl = cfg.rpcUrl
        const contracts = cfg.contracts
        logger.debug('chainId =', chainId)
        logger.debug('enabled =', enabled)
        logger.debug('chainName =', chainName)
        logger.debug('currency =', currency)
        logger.debug('rpcUrl =', rpcUrl)
        logger.debug('contracts =', contracts)
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        logger.debug('Created a provider by rpcUrl', rpcUrl)
        const chain = new Chain(chainId, chainName, rpcUrl, currency)
        contracts.forEach((c, i) => {
            logger.debug('contract at index ', i, c)
            const address = c.address
            const abi = c.abi
            const tokenStandard = c.tokenStandard
            const contract = new Contract(chainId, address, abi, provider, tokenStandard)
            logger.debug('Created a contractInstance by address', address, 'abi:', abi)
            chain.addContractInstance(address, contract)
        })
        chains.set(chainId, chain)
    })
    return chains
}

logger.debug(`config.env: ${config.env}`)
const chains = createChains(config.env)

module.exports = {chains}