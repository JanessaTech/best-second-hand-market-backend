const logger = require('../../helpers/logger')
const {ethers} = require('ethers')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {ConfigContractError} = require('./ConfigErrors')

module.exports = class Contract {
    #chainId
    #address
    #abi
    #provider
    #tokenStandard
    #instance

    constructor(chainId, address, abi, provider, tokenStandard) {
        this.#chainId = chainId
        this.#address = address
        this.#abi = abi
        this.#provider = provider
        this.#tokenStandard = tokenStandard
        this.#instance = new ethers.Contract(address, abi, provider)
        this.#instance.on('mint_tracer', (to, uri) => {
            logger.debug('Received from mint_tracer event: ', 'to =', to, ' uri =', uri)
        })
        this.#instance.on('mintBatch_tracer', (to, uris) => {
            logger.debug('Received from mintBatch_tracer event: ', 'to =', to, ' uri =', uris)
        })
        this.#instance.on('buy_tracer', (from, to, ids) => {
            logger.debug('Received from buy_tracer event: ', 'from =', from, 'to =', to, ' ids =', ids)
        })
        this.#instance.on('doSafeBuy_tracer', (from, to, ids) => {
            logger.debug('Received from doSafeBuy_tracer event: ', 'from =', from, 'to =', to, ' ids =', ids)
        })
        this.#instance.on('buyBatch_tracer', (froms, to, idss) => {
            logger.debug('Received from buyBatch_tracer event: ', 'from =', froms, 'to =', to, ' idss =', idss)
        })
        this.#instance.on('doSafeBuyBatch_tracer', (froms, to, idss) => {
            logger.debug('Received from doSafeBuyBatch_tracer event: ', 'from =', froms, 'to =', to, ' idss =', idss)
        })
    }

    get chainId() {
        return this.#chainId
    }

    get address() {
        return this.#address
    }

    get abi() {
        return this.#abi
    }

    get provider() {
        return this.#provider
    }

    get tokenStandard() {
        return this.#tokenStandard
    }

    get instance() {
        return this.#instance
    }

    async getOwnerOfToken(tokenId) {
        logger.debug(messageHelper.getMessage('config_contract_get_owner', tokenId, this.#chainId, this.#address))
        const owner = await this.#instance.ownerOfToken(tokenId)
        logger.debug('The owner of tokenId ', tokenId, ' is :', owner)
        if (owner === ethers.ZeroAddress) {
            throw new ConfigContractError({key: 'config_contract_token_not_found', params:[tokenId, this.#chainId, this.#address], code:404})
        }
        return owner
    }

    async getUri(tokenId) {
        logger.debug(messageHelper.getMessage('config_contract_get_uri', tokenId, this.#chainId, this.#address))
        const uri = await this.#instance.getUri(tokenId)
        logger.debug('The uri of tokenId ', tokenId, ' is :', uri)
        if (!uri) {
            throw new ConfigContractError({key: 'config_contract_invalid_uri', params:[tokenId, this.#chainId, this.#address], code:400})
        }
        return uri
    }

    async getAllTokenIds() {
        logger.debug(messageHelper.getMessage('contract_contract_get_alltokenIds', this.#chainId, this.#address))
        const tokenIds = await this.#instance.getAllTokenIds()
        logger.debug('tokenIds:', tokenIds)
        return tokenIds.map((t) => Number(t))
    }

    async tokensOfAddress(address) {
        logger.debug(messageHelper.getMessage('contract_contract_get_tokenIds_byAddress', address, this.#chainId, this.#address))
        const tokenIds = await this.#instance.tokensOfAddress(address)
        logger.debug('tokenIds:', tokenIds)
        return tokenIds.map((t) => Number(t))
    }

    toString() {
        return `chainId = ${this.#chainId} \n address = ${this.#address}\n tokenStandard = ${this.#tokenStandard}\n abi = ${this.#abi}`
    }
}