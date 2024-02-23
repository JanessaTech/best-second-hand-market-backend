const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')

class NftService {
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
        logger.log('NftService.update')
        try {
            const byId = await nftDao.findById(update.id)
            if (byId) {
                throw new NftError({key: 'nft_update_failed', params:[update.id], code:404})
            }
            return await nftDao.findByIdAndUpdate(update)
        } catch (e) {
            logger.debug('Failed to update the nft record by id = ', nft.id)
            throw e
        }

    }
}

const nftService = new NftService()
module.exports = nftService