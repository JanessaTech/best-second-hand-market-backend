const nftDao = require('../../dao/nft')
const userDao = require('../../dao/user')
const {NftError} = require('../../routes/nft/NftErrors')
const {ConfigChainError} = require('../../config/configParsers/ConfigErrors')
const {chainParser} = require('../../config/configParsers')
const nftService = require('../../services/nft.service')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const { when } = require('jest-when')
const {ethers} = require('ethers')
const {convertToURL} = require('../../helpers/utils')

const id = 1
const chainId = 2
const address = 'some-address'
const tokenId = 3
const nft = {id: id, chainId: chainId, address: address, tokenId: tokenId, toJSON: () => { return { id: id, chainId: chainId, address: address, tokenId: tokenId}}}
const user = {toJSON: () => {return {}}}
jest.mock('../../helpers/utils', () => ({ convertToURL: jest.fn() }))

beforeAll(() => {
    nftDao.findById = jest.fn()
    userDao.findByAddress = jest.fn()
    chainParser.getChain = jest.fn()
    chainParser.getContractInstance = jest.fn()
    chainParser.getTokenStandard = jest.fn()
    messageHelper.getMessage = jest.fn() 
})

describe('NftService', () => {
    describe('getNFTById', () => {
        test('expects NftError when the NFT is not found', async () => {
            when(nftDao.findById).calledWith(1).mockRejectedValue(new NftError())

            await expect(nftService.getNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
        })
        test('expects NftError when chainId in the NFT is invalid', async () => {    
                   
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chainParser.getChain).calledWith(chainId).mockImplementation(() => {throw new ConfigChainError()})

            await expect(nftService.getNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
        })
        test('expects NftError when address in the NFT is invalid', async () => {
            const chain = {chainId: chainId}
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chainParser.getChain).calledWith(chainId).mockReturnValue(chain)
            when(chainParser.getContractInstance).calledWith(chain, address).mockImplementation(() => {throw new ConfigChainError()})

            await expect(nftService.getNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(chainParser.getContractInstance).toHaveBeenCalledWith(chain, address)
        })
        test('expects NftError when tokenId in the NFT is invalid', async () => {
            const chain = {chainId: chainId}
            const contractInstance = {}
            contractInstance.getOwnerOfToken = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chainParser.getChain).calledWith(chainId).mockReturnValue(chain)
            when(chainParser.getContractInstance).calledWith(chain, address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue(ethers.ZeroAddress)
            when(messageHelper.getMessage).calledWith('nft_failed_get_owner', tokenId, chainId, address, expect.anything(Error)).mockReturnValue('some-message')

            await expect(nftService.getNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveBeenCalledWith('nft_failed_get_owner', tokenId, chainId, address, expect.anything(Error))
        })
        test('expects NftError when the user is not found by the address of nft owner', async () => {
            const chain = {chainId: chainId}
            const contractInstance = {}
            chain.getContractInstance = jest.fn()
            contractInstance.getOwnerOfToken = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chainParser.getChain).calledWith(chainId).mockReturnValue(chain)
            when(chainParser.getContractInstance).calledWith(chain, address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue(address)
            when(userDao.findByAddress).calledWith(address).mockResolvedValue(undefined)
            when(messageHelper.getMessage).calledWith('user_not_found_address', address).mockReturnValue('some message')

            await expect(nftService.getNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveBeenCalledWith('user_not_found_address',address)
        })
   
        test('expects NftError when uri of the NFT is invalid', async () => {
            const chain = {chainId: chainId}
            const contractInstance = {}
            chain.getContractInstance = jest.fn()
            contractInstance.getOwnerOfToken = jest.fn()
            contractInstance.getUri = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chainParser.getChain).calledWith(chainId).mockReturnValue(chain)
            when(chainParser.getContractInstance).calledWith(chain, address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue('some-owner-address')
            when(userDao.findByAddress).calledWith('some-owner-address').mockResolvedValue(user)
            when(contractInstance.getUri).calledWith(tokenId).mockResolvedValue('')
            when(messageHelper.getMessage).calledWith('nft_failed_get_uri', tokenId, chainId, address, expect.anything(Error)).mockReturnValue('some-message')

            await expect(nftService.getNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveBeenCalledWith('nft_failed_get_uri', tokenId, chainId, address, expect.anything(Error))
        })
        test('should return a full nft successfully', async () => {
            const chain = {chainId: chainId, chainName: 'some-chainName' }
            const contractInstance = {tokenStandard: 'some-tokenStandard'}
            chain.getContractInstance = jest.fn()
            contractInstance.getOwnerOfToken = jest.fn()
            contractInstance.getUri = jest.fn()
            
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chainParser.getChain).calledWith(chainId).mockReturnValue(chain)
            when(chainParser.getContractInstance).calledWith(chain, address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue('some-owner-address')
            when(userDao.findByAddress).calledWith('some-owner-address').mockResolvedValue(user)
            when(contractInstance.getUri).calledWith(tokenId).mockResolvedValue('some-uri')
            when(chain.getContractInstance).calledWith(address).mockReturnValue(contractInstance)
            convertToURL.mockReturnValue('some-url')

            const res = await nftService.getNFTById(1)

            expect(res).toEqual({
                id: id, 
                chainId: chainId, 
                address: address, 
                tokenId: tokenId,
                owner: {},
                uri: 'some-uri',
                url: 'some-url',
                chainName: 'some-chainName',
                tokenStandard: 'some-tokenStandard'
            })
        })
    })
})