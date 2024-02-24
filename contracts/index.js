const config = require('../config')
const logger = require('../helpers/logger')
const {ethers} = require('ethers')

const createProviders = (env) => {
    logger.info('Create providers for env', env)
    let providerMap = new Map()
    const cfgs = config.chains[env]
    if (!cfgs) {
        logger.error('Can not find configuration by env', env, '. Please check the correctness of config.chains in config.global.js')
        process.exit()
    }
    cfgs.filter((cfg) => cfg.enabled).forEach((cfg, index) => {
        logger.debug("cfg at index", index)
        const chainId = cfg.chainId
        const enabled = cfg.enabled
        const chainName = cfg.chainName
        const rpcUrl = cfg.rpcUrl
        const contracts = cfg.contracts
        logger.debug('chainId =', chainId)
        logger.debug('enabled =', enabled)
        logger.debug('chainName =', chainName)
        logger.debug('rpcUrl =', rpcUrl)
        logger.debug('contracts =', contracts)
        let contractMap = new Map()
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        logger.debug('Created a provider by rpcUrl', rpcUrl)
        contracts.forEach((contract, i) => {
            logger.debug('contract at index ', i, contract)
            const address = contract.address
            const abi = contract.abi
            const tokenStandard = contract.tokenStandard
            const contractInstance = new ethers.Contract(address, abi, provider)
            logger.debug('Created a contractInstance by address', address, 'abi:', abi)
            contractMap.set(address, {contractInstance: contractInstance, tokenStandard: tokenStandard})
        })
        providerMap.set(chainId, {chainName: chainName, provider: provider, contracts: contractMap})
    })

    return providerMap
}

logger.debug(`config.env: ${config.env}`)
const providers = createProviders(config.env)

module.exports = providers