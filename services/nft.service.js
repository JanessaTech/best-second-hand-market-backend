const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')


class NftService {
    async mint(nft) {
        logger.info('NftService.mint')
        try {
            const byTokenId = nftDao.findByTokenId(nft.tokenId)
            if (byTokenId) {
                throw new NftError({key: 'nft_mint_duplication_tokenId', params:[nft.tokenId], code: 400})
            }
            return await nftDao.create(nft)
        } catch (e) {
            logger.debug('Failed to save nft history ', nft)
            throw e
        }
    }
}

const nftService = new NftService()
module.exports = nftService