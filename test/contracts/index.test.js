const {chains} = require('../../contracts')
const config  = require('../../config')

describe('createProviders', () => {
    // you need to set process.env.NODE_ENV = 'test' in .jest/setEnvVars.js
    test('check if chains on local are created successfully', () => {
        if (config.env === 'local') {
            const cfgs = config.chains[config.env]
            cfgs.filter((cfg) => cfg.enabled).forEach((cfg) => {
                const chainId = cfg.chainId
                const contracts = cfg.contracts
                expect(chains.get(chainId).getAllContractInstances().size).toEqual(contracts.length)
                contracts.forEach((contract) => {
                    const address = contract.address
                    expect(chains.get(chainId).getContractInstance(address)).toBeDefined()
                })
            })

            expect(cfgs.filter((cfg) => cfg.enabled).length).toEqual(chains.size)
        }
    })
    // you need to set process.env.NODE_ENV = 'stage' in .jest/setEnvVars.js
    test('check if chains on testnet are created successfully', () => {
        if (config.env === 'testnet') {
            const cfgs = config.chains[config.env]
            cfgs.filter((cfg) => cfg.enabled).forEach((cfg) => {
                const chainId = cfg.chainId
                const contracts = cfg.contracts
                expect(chains.get(chainId).getAllContractInstances().size).toEqual(contracts.length)
                contracts.forEach((contract) => {
                    const address = contract.address
                    expect(chains.get(chainId).getContractInstance(address)).toBeDefined()
                })
            })

            expect(cfgs.filter((cfg) => cfg.enabled).length).toEqual(chains.size)
        }
    })
    // you need to set process.env.NODE_ENV = 'prod' in .jest/setEnvVars.js
    test('check if providers on mainnet are created successfully', () => {
        if (config.env === 'mainnet') {
            const cfgs = config.chains[config.env]
            cfgs.filter((cfg) => cfg.enabled).forEach((cfg) => {
                const chainId = cfg.chainId
                const contracts = cfg.contracts
                expect(chains.get(chainId).getAllContractInstances().size).toEqual(contracts.length)
                contracts.forEach((contract) => {
                    const address = contract.address
                    expect(chains.get(chainId).getContractInstance(address)).toBeDefined()
                })
            })

            expect(cfgs.filter((cfg) => cfg.enabled).length).toEqual(chains.size)
        }
    })
})