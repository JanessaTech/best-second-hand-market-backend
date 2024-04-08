const {ethers} = require('ethers')

module.exports = class Chain {
    #chainId
    #chainName
    #rpcUrl
    #currency
    #provider
    #contractInstances = new Map()

    constructor(chainId, chainName, rpcUrl, currency) {
        this.#chainId = chainId
        this.#chainName = chainName
        this.#rpcUrl = rpcUrl
        this.#currency = currency
        this.#provider = new ethers.JsonRpcProvider(rpcUrl)
    }

    get chainId() {
        return this.#chainId
    }

    get chainName() {
        return this.#chainName
    }

    get rpcUrl() {
        return this.#rpcUrl
    }

    get provider() {
        return this.#provider
    }

    addContractInstance(address, _instance) {
        this.#contractInstances.set(address, _instance)
    }
    
    getContractInstance(address) {
        return this.#contractInstances.get(address)
    }

    getAllContractInstances() {
        return this.#contractInstances
    }

    getContractInstancesByStandard(tokenStandard) {
        const newMap = new Map([...this.#contractInstances].filter(([k, v]) => v.tokenStandard === tokenStandard))
        return newMap
    }

    toString () {
        return `chainId = ${this.#chainId}, chainName = ${this.#chainName}, rpcUrl = ${this.#rpcUrl}, currency = ${this.#currency}. ${this.#contractInstances.size} contractInstances`
    }
}