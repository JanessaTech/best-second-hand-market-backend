const Contract = require('./contract')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const logger = require('../../helpers/logger')

module.exports = class CacheableContract {
    #chainId
    #address
    #tokenStandard
    
    #ownerMap = new Map()
    #uriMap = new Map()
    #allTokenIds = undefined
    #tokens = new Map()
    #contract

    constructor(chainId, address, abi, provider, tokenStandard) {
        this.#chainId = chainId
        this.#address = address
        this.#tokenStandard = tokenStandard
        this.#contract = new Contract(chainId, address, abi, provider, tokenStandard)
    }

    get tokenStandard() {
        return this.#tokenStandard
    }

    async warmUp() {
        const startTime = performance.now()
        await this.getAllTokenIds()
        if (this.#allTokenIds) {
            const owners = new Set()
            for (const token of this.#allTokenIds) {
                const owner  = await this.getOwnerOfToken(token)
                owners.add(owner)
                await this.getUri(token)
            }
            for (const owner of owners) {
                await this.tokensOfAddress(owner)
            }
        }
        const endTime = performance.now()
        logger.info(messageHelper.getMessage('config_contract_cache_warmup', this.#chainId, this.#address, endTime - startTime))
    }

    async getOwnerOfToken(tokenId) {
        if (this.#ownerMap.get(tokenId)) return this.#ownerMap.get(tokenId)
        const owner = await this.#contract.getOwnerOfToken(tokenId)
        this.#ownerMap.set(tokenId, owner)// cache the owner of tokenId
        logger.debug(messageHelper.getMessage('config_contract_cache_owner', owner, tokenId, this.#chainId, this.#address))
        return owner
    }

    async getUri(tokenId) {
        if (this.#uriMap.get(tokenId)) return this.#uriMap.get(tokenId)
        const uri = await this.#contract.getUri(tokenId)
        this.#uriMap.set(tokenId, uri) //cache the uri of tokenId
        logger.debug(messageHelper.getMessage('config_contract_cache_uri', uri, tokenId, this.#chainId, this.#address))
        return uri
    }

    async getAllTokenIds() {
        if (this.#allTokenIds) return this.#allTokenIds
        const allTokenIds = await this.#contract.getAllTokenIds()
        this.#allTokenIds = allTokenIds  //cache the all token ids
        logger.debug(messageHelper.getMessage('config_contract_cache_alltokenIds', allTokenIds, this.#chainId, this.#address))
        return allTokenIds
    }

    async tokensOfAddress(address) {
        if (this.#tokens.get(address)) return this.#tokens.get(address)
        const tokens = await this.#contract.tokensOfAddress(address)
        this.#tokens.set(address, tokens)
        logger.debug(messageHelper.getMessage('config_contract_cache_tokens', tokens, address, this.#chainId, this.#address))
        return tokens
    }
}