const Contract = require('./contract')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const logger = require('../../helpers/logger')
const {hSet, hGet, hDel, hKeys} = require('../../infra/redis/ops')

module.exports = class CacheableContract {
    #chainId
    #address
    #tokenStandard

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
        //logger.info(`cleanup cache under chainId=${this.#chainId} and address=${this.#address}`)
        //await this.cleanupCache()
        logger.info(`start filling cache under chainId=${this.#chainId} and address=${this.#address}`)
        const allTokenIds = await this.getAllTokenIds()
        if (allTokenIds && allTokenIds.length > 0) {
            const owners = new Set()
            for (const token of allTokenIds) {
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

    async cleanupCache() {
        try {
            const fields = await hKeys(`${this.#chainId}:${this.#address}`)
            if (fields) {
                fields.forEach(async (field) => {
                    await hDel(`${this.#chainId}:${this.#address}`, fields)
                })
            }
        } catch (err) {
            logger.error(messageHelper.getMessage('config_contract_cache_clean_failed', this.#chainId, this.#address, err))
        }
    }

    async getOwnerOfToken(tokenId) {
        const ownerFromCache = await hGet(`${this.#chainId}:${this.#address}`, `owner_${tokenId}`)
        if (ownerFromCache) return ownerFromCache
        const owner = await this.#contract.getOwnerOfToken(tokenId)
        await hSet(`${this.#chainId}:${this.#address}`, `owner_${tokenId}`, owner) // cache the owner of tokenId
        logger.debug(messageHelper.getMessage('config_contract_cache_owner', owner, tokenId, this.#chainId, this.#address))
        return owner
    }

    async getUri(tokenId) {
        const uriFromCache = await hGet(`${this.#chainId}:${this.#address}`, `uri_${tokenId}`)
        if (uriFromCache) return uriFromCache
        const uri = await this.#contract.getUri(tokenId)
        await hSet(`${this.#chainId}:${this.#address}`, `uri_${tokenId}`, uri) // cache the uri of tokenId
        logger.debug(messageHelper.getMessage('config_contract_cache_uri', uri, tokenId, this.#chainId, this.#address))
        return uri
    }

    async getAllTokenIds() {
        const allTokenIdsFromCache = await hGet(`${this.#chainId}:${this.#address}`, 'all_tokenids')
        if (allTokenIdsFromCache) allTokenIdsFromCache.split(',').map((id) => Number(id))
        const allTokenIds = await this.#contract.getAllTokenIds()
        if (allTokenIds && allTokenIds.length > 0) {
            await hSet(`${this.#chainId}:${this.#address}`, 'all_tokenids', allTokenIds.join(','))
            logger.debug(messageHelper.getMessage('config_contract_cache_alltokenIds', allTokenIds, this.#chainId, this.#address))
            return allTokenIds
        }
        return []
    }

    async tokensOfAddress(address) {
        const tokensFromCache = await hGet(`${this.#chainId}:${this.#address}`, address)
        if (tokensFromCache) return tokensFromCache.split(',').map((id) => Number(id))
        const tokens = await this.#contract.tokensOfAddress(address)
        if (tokens && tokens.length > 0) {
            await hSet(`${this.#chainId}:${this.#address}`, address, tokens.join(','))
            logger.debug(messageHelper.getMessage('config_contract_cache_tokens', tokens, address, this.#chainId, this.#address))
            return tokens
        }
        return []
    }
}