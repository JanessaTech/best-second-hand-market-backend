const config = require('../../config/configuration')
const {chainParser} = require('../../config/configParsers')

const testif = (condition) => condition ? test : test.skip;

describe('ConfigChainParser', () => {
    // you need to set process.env.NODE_ENV = 'dev' in .jest/setEnvVars.js
    describe('config.env = local', () => {
        testif(config.env === 'local')('getChain', () => {
            const localChains = config.chains.local.filter((cfg) => cfg.enabled)
            localChains.forEach((chain) => {
                const _c = chainParser.getChain(chain.chainId)
                expect(_c).toBeDefined()
            })
        })
        testif(config.env === 'local')('getContractInstance', () => {
            const localChains = config.chains.local.filter((cfg) => cfg.enabled)
            localChains.forEach((chain) => {
                const _chain = chainParser.getChain(chain.chainId)
                const contracts = chain.contracts
                contracts.forEach((contract) => {
                    const address = contract.address
                    const _contractInstance = chainParser.getContractInstance(_chain, address)
                    expect(_contractInstance).toBeDefined()

                })
            })
        })
        testif(config.env === 'local')('getTokenStandard', () => {
            const localChains = config.chains.local.filter((cfg) => cfg.enabled)
            localChains.forEach((chain) => {
                const chainId = chain.chainId
                const contracts = chain.contracts
                contracts.forEach((contract) => {
                    const address = contract.address
                    const tokenStandard = chainParser.getTokenStandard(chainId, address)
                    expect(tokenStandard).toBeDefined()

                })
            })
        })
    })
    // you need to set process.env.NODE_ENV = 'stage' in .jest/setEnvVars.js
    describe('config.env = testnet', () => {
        testif(config.env === 'testnet')('getChain', () => {
            const testnetChains = config.chains.testnet.filter((cfg) => cfg.enabled)
            testnetChains.forEach((chain) => {
                const _c = chainParser.getChain(chain.chainId)
                expect(_c).toBeDefined()
            })
        })
        testif(config.env === 'testnet')('getContractInstance', () => {
            const testnetChains = config.chains.testnet.filter((cfg) => cfg.enabled)
            testnetChains.forEach((chain) => {
                const _chain = chainParser.getChain(chain.chainId)
                const contracts = chain.contracts
                contracts.forEach((contract) => {
                    const address = contract.address
                    const _contractInstance = chainParser.getContractInstance(_chain, address)
                    expect(_contractInstance).toBeDefined()

                })
            })
        })
        testif(config.env === 'testnet')('getTokenStandard', () => {
            const testnetChains = config.chains.testnet.filter((cfg) => cfg.enabled)
            testnetChains.forEach((chain) => {
                const chainId = chain.chainId
                const contracts = chain.contracts
                contracts.forEach((contract) => {
                    const address = contract.address
                    const tokenStandard = chainParser.getTokenStandard(chainId, address)
                    expect(tokenStandard).toBeDefined()

                })
            })
        })
    })
    // you need to set process.env.NODE_ENV = 'prod' in .jest/setEnvVars.js
    describe('config.env = mainnet', () => {
        testif(config.env === 'mainnet')('getChain', () => {
            const mainnetChains = config.chains.mainnet.filter((cfg) => cfg.enabled)
            mainnetChains.forEach((chain) => {
                const _c = chainParser.getChain(chain.chainId)
                expect(_c).toBeDefined()
            })
        })
        testif(config.env === 'mainnet')('getContractInstance', () => {
            const mainnetChains = config.chains.mainnet.filter((cfg) => cfg.enabled)
            mainnetChains.forEach((chain) => {
                const _chain = chainParser.getChain(chain.chainId)
                const contracts = chain.contracts
                contracts.forEach((contract) => {
                    const address = contract.address
                    const _contractInstance = chainParser.getContractInstance(_chain, address)
                    expect(_contractInstance).toBeDefined()

                })
            })
        })
        testif(config.env === 'mainnet')('getTokenStandard', () => {
            const localChains = config.chains.mainnet.filter((cfg) => cfg.enabled)
            localChains.forEach((chain) => {
                const chainId = chain.chainId
                const contracts = chain.contracts
                contracts.forEach((contract) => {
                    const address = contract.address
                    const tokenStandard = chainParser.getTokenStandard(chainId, address)
                    expect(tokenStandard).toBeDefined()
                })
            })
        })
    })
})