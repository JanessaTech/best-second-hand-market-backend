const config = require('../configuration')
const logger = require('../../helpers/logger')
const {ethers} = require('ethers')
const Chain = require('./chain')
const Contract = require('./contract')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {ConfigChainError} = require('./ConfigErrors')

class ConfigChainParser {
    #chains

    /**
     * Parse the config.chains in config.common.js according to config.env
     * 
     * @param {string} [env] - The value of config.env
     */
    constructor(env) {
        const cfgs = config.chains[env]
        if (!cfgs) {
            logger.error('Can not find config.chains by env', env, '. Please check the correctness of config.chains in config.common.js')
            process.exit()
        }
        logger.info('Parse config.chains for env', env)
        let chains = new Map()
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
        this.#chains = chains
    }

    /**
     * Get the Chain object by chainId
     * 
     * @param {number} [chainId]  - chainId
     * @returns {Object} - The Chain object constructed from config.chains in config.common.js to represent the chainId
     */
    getChain(chainId) {
        logger.debug('chainId = ', chainId, 'typeof chainId = ', typeof chainId)
        const chain = this.#chains.get(chainId)
        if (!chain) {
            const errMsg = messageHelper.getMessage('config_chain_not_found', chainId)
            logger.error(errMsg)
            throw new ConfigChainError({message: errMsg, code: 400})
        }
        return chain
    }

    /**
     * Get the Contract object by chain object and the smart contract address
     * 
     * @param {Object} [chain] - The Chain object to get contract instance from by contract address
     * @param {string} [address] - The smart contract address
     * @returns {Object} - The Contract object representing the smart contract instance which we will use to interact with
     */
    getContractInstance(chain, address) {
        logger.debug('address = ', address, 'typeof address = ', typeof address)
        const contractInstance = chain.getContractInstance(address)
        if(!contractInstance) {
            const errMsg = messageHelper.getMessage('config_contractInst_not_found', chain.chainId, address)
            logger.error(errMsg)
            throw new ConfigChainError({message: errMsg, code: 400})
        }
        return contractInstance 
    }

    /**
     * Get the tokenStandard by chainId and the smart contract address
     * 
     * @param {number} [chainId]  - chainId
     * @param {string} [address] - The smart contract address
     * @returns {string} - tokenStandard for the smart contract
     */
    getTokenStandard(chainId, address) {
        const chain = this.getChain(chainId)
        const contractInstance = this.getContractInstance(chain, address)
        const tokenStandard = contractInstance.tokenStandard
        if (!tokenStandard) {
            const errMsg = messageHelper.getMessage('config_tokenStandard_not_found', chain.chainId, address)
            logger.error(errMsg)
            throw new ConfigChainError({message: errMsg, code: 400})
        }
        return tokenStandard
    }

    async getFilterByChains({owner, nftIds, status}) {
        let merged = []
        for (const [chainId, chain] of this.#chains.entries()) {
            if (chain.getAllContractInstances()) {
                for(const [address, instance] of chain.getAllContractInstances()) {
                    try {
                        const tokenIds = owner ? await instance.tokensOfAddress(owner) : await instance.getAllTokenIds()
                        if (tokenIds && tokenIds.length > 0) {
                            const ands = []
                            ands.push({chainId: chainId})
                            ands.push({address: address})
                            ands.push({tokenId: {$in: tokenIds}})
                            if (status) {
                                ands.push({status: status})
                            }
                            if(nftIds) {
                                if (nftIds.length === 0) {
                                    ands.push({_id: {$in: [-1]}})
                                } else {
                                    ands.push({_id: {$in: nftIds}})
                                }
                            }
                            merged.push({$and: ands})
                        }
                    } catch (e) {
                        logger.error(messageHelper.getMessage('contract_read_failed', e))
                    }
                }
            }
        }
        const filter = merged.length > 0 ? {$or: merged} : {_id: -1} // we return empty if all of chains are not readable/don't have tokenIds
        logger.debug('filter = ', filter)
        return filter
    }
}

logger.debug(`config.env: ${config.env}`)
const chainParser = new ConfigChainParser(config.env)
module.exports = chainParser