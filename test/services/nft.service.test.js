const nftDao = require('../../dao/nft')
const {NftError} = require('../../routes/nft/NftErrors')
const {chains} = require('../../contracts')
const nftService = require('../../services/nft.service')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const { when } = require('jest-when')
const {ethers} = require('ethers')

const id = 1
const chainId = 2
const address = 'some-address'
const tokenId = 3
const nft = {id: id, chainId: chainId, address: address, tokenId: tokenId, toJSON: () => { return { id: id, chainId: chainId, address: address, tokenId: tokenId}}}

beforeAll(() => {
    nftDao.findById = jest.fn()
    chains.get = jest.fn()
    messageHelper.getMessage = jest.fn() 
})

describe('NftService', () => {
    describe('getFullNFTById', () => {
        test('expects UserError when the NFT is not found', async () => {
            when(nftDao.findById).calledWith(1).mockRejectedValue(new NftError())

            await expect(nftService.getFullNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
        })
        test('expects UserError when chainId in the NFT is invalid', async () => {    
                   
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chains.get).calledWith(chainId).mockReturnValue(undefined)
            when(messageHelper.getMessage).calledWith('config_chain_not_found', chainId).mockReturnValue('some-message')

            await expect(nftService.getFullNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveBeenCalledWith('config_chain_not_found', chainId)
        })
        test('expects UserError when address in the NFT is invalid', async () => {
            const chain = {chainId: chainId}
            chain.getContractInstance = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chains.get).calledWith(chainId).mockReturnValue(chain)
            when(chain.getContractInstance).calledWith(address).mockReturnValue(undefined)
            when(messageHelper.getMessage).calledWith('config_contractInst_not_found', chainId, address).mockReturnValue('some-message')

            await expect(nftService.getFullNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveBeenCalledWith('config_contractInst_not_found', chainId, address)
        })
        test('expects UserError when tokenId in the NFT is invalid', async () => {
            const chain = {chainId: chainId}
            const contractInstance = {}
            chain.getContractInstance = jest.fn()
            contractInstance.getOwnerOfToken = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chains.get).calledWith(chainId).mockReturnValue(chain)
            when(chain.getContractInstance).calledWith(address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue(ethers.ZeroAddress)
            when(messageHelper.getMessage).calledWith('nft_failed_get_owner', tokenId, chainId, address, expect.anything(Error)).mockReturnValue('some-message')

            await expect(nftService.getFullNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveLastReturnedWith('some-message')
        })
   
        test('expects UserError when uri of the NFT is invalid', async () => {
            const chain = {chainId: chainId}
            const contractInstance = {}
            chain.getContractInstance = jest.fn()
            contractInstance.getOwnerOfToken = jest.fn()
            contractInstance.getUri = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chains.get).calledWith(chainId).mockReturnValue(chain)
            when(chain.getContractInstance).calledWith(address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue('some-owner-address')
            when(contractInstance.getUri).calledWith(tokenId).mockResolvedValue('')
            when(messageHelper.getMessage).calledWith('nft_failed_get_uri', tokenId, chainId, address, expect.anything(Error)).mockReturnValue('some-message')

            await expect(nftService.getFullNFTById(1))
            .rejects
            .toBeInstanceOf(NftError)
            expect(messageHelper.getMessage).toHaveLastReturnedWith('some-message')
        })
        test('should return a full nft successfully', async () => {
            const chain = {chainId: chainId, chainName: 'some-chainName' }
            const contractInstance = {tokenStandard: 'some-tokenStandard'}
            chain.getContractInstance = jest.fn()
            contractInstance.getOwnerOfToken = jest.fn()
            contractInstance.getUri = jest.fn()
           
            when(nftDao.findById).calledWith(1).mockResolvedValue(nft)
            when(chains.get).calledWith(chainId).mockReturnValue(chain)
            when(chain.getContractInstance).calledWith(address).mockReturnValue(contractInstance)
            when(contractInstance.getOwnerOfToken).calledWith(tokenId).mockResolvedValue('some-owner-address')
            when(contractInstance.getUri).calledWith(tokenId).mockResolvedValue('some-uri')

            const res = await nftService.getFullNFTById(1)

            expect(res).toEqual({
                id: id, 
                chainId: chainId, 
                address: address, 
                tokenId: tokenId,
                owner: 'some-owner-address',
                uri: 'some-uri',
                chainName: 'some-chainName',
                tokenStandard: 'some-tokenStandard'
            })
        })
    })
})