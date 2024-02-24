const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const {ethers} = require('ethers')
const providers = require('../contracts')

class NftService {

    getContractInstance(chainId, address) {
        const provider = providers.get(chainId)
        if (provider) {
            if (provider?.contracts) {
                const contract = provider.contracts.get(address)
                return contract
            }
            return undefined
        }
        return undefined
    }

    async getNftOwner(chainId, address, tokenId) {
        try {
            const contractInstance = this.getContractInstance(chainId, address)
            if (!contractInstance) {
                throw new NftError({key: 'nft_contractInst_not_found', params: [chainId, address], code: 400})
            }
            const owner = await contractInstance.ownerOfToken(tokenId)
            logger.info('The owner of tokenId ', tokenId, ' is :', owner)
            return owner
        } catch (e) {
            logger.debug('Failed to get NFT owner by token id', tokenId, ' due to ', e)
        }
    }

    async mint(nft) {
        logger.info('NftService.mint')
        try {
            const byTokenId = await nftDao.findByChainIdAddressTokenId(nft.chainId, nft.address, nft.tokenId)
            if (byTokenId) {
                throw new NftError({key: 'nft_mint_duplication', params:[nft.chainId, nft.address, nft.tokenId], code: 400})
            }
            return await nftDao.create(nft)
        } catch (e) {
            logger.debug('Failed to save nft history ', nft)
            throw e
        }
    }

    async update(update) {
        logger.info('NftService.update')
        try {
            const nft = await nftDao.findByIdAndUpdate(update)
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[update._id], code:404})
            }
            return nft
        } catch (e) {
            logger.debug('Failed to update the nft record by _id = ', update._id)
            throw e
        }
    }

    async getFullNFTById(id) {
        logger.info('NftService.getFullNFTById. id=', id)
        try {
            const nft = await nftDao.findById(id)
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[update._id], code:404})
            }
            await this.getNftOwner(nft.chainId, nft.address, nft.tokenId)

            return nft
        } catch (e) {
            logger.debug('Failed to get a full nft by id ', id)
            throw e
        }
    }

    
}

const nftService = new NftService()
module.exports = nftService