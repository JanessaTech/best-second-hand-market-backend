const logger = require('../../helpers/logger')
const {ethers} = require('ethers')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')

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
        const owner = await this.#instance.ownerOfToken(tokenId)
        return owner
    }

    async getUri(tokenId) {
        const uri = await this.#instance.getUri(tokenId)
        return uri
    }

    async getAllTokenIds() {
        logger.debug(messageHelper.getMessage('contract_get_tokenIds', this.#chainId, this.#address))
        const tokenIds = await this.#instance.getAllTokenIds()
        logger.debug('tokenIds:', tokenIds)
        return tokenIds.map((t) => Number(t))
    }

    async tokensOfAddress(address) {
        logger.debug(messageHelper.getMessage('contract_get_tokenIds_byAddress', address, this.#chainId, this.#address))
        const tokenIds = await this.#instance.tokensOfAddress(address)
        logger.debug('tokenIds:', tokenIds)
        return tokenIds.map((t) => Number(t))
    }

    toString() {
        return `chainId = ${this.#chainId} \n address = ${this.#address}\n tokenStandard = ${this.#tokenStandard}\n abi = ${this.#abi}`
    }
}