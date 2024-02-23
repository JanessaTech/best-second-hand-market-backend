const logger = require('../helpers/logger')
const {NFT} = require('../models')
const {NftError} = require('../routes/nft/NftErrors')

class NftDAO {
    async create(nft) {
        try {
            const nftDao = new NFT({
                tokenId: nft.tokenId,
                title: nft.title,
                category: nft.category,
                chainId: nft.chainId,
                address: nft.address,
                description: nft.description,
                status: nft.status,
                price: nft.price
            })
            const savedNft = await nftDao.save()
            logger.debug('NftDAO.create. A new nft record is saved successfully', savedNft)
            return savedNft
        } catch (err) {
            logger.debug('Failed to save user due to ', err)
            throw new NftError({key: 'nft_save_validation_failed', params: [nft.address, nft.address, nft.tokenId], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async findByChainIdAddressTokenId(chainId, address, tokenId) {
        const nft = await NFT.findOne({chainId:chainId, address: address, tokenId: tokenId})
        return nft
    }
}

const nftDao = new NftDAO()
module.exports = nftDao