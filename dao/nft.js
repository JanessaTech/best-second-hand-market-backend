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
            logger.error('Failed to save user due to ', err)
            throw new NftError({key: 'nft_save_validation_failed', params: [nft.address, nft.address, nft.tokenId], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async findByIdAndUpdate(update) {
        const filter = {_id: update._id}
        var _update = {}
        if (update?.price) {
            _update.price = update.price
        }
        if (update?.status) {
            _update.status = update.status
        }
        try {
            const nft = await NFT.findOneAndUpdate(filter, _update, {new: true})
            return nft
        } catch (err) {
            logger.error('Failed to update nft due to ', err)
            throw e
        }
    }

    async findOneByFilter(filter) {
        const nft = await NFT.findOne(filter)
        return nft
    }

    async findOneByFilterWithUpdatedView(filter) {
        const nft = await NFT.findOneAndUpdate(filter, { $inc: { view: 1 } },{ new: true})
        return nft
    }

    async queryAllByFilter(filter) {
        const nfts = await NFT.find(filter)
        return nfts
    }

    async queryByPagination(filter, options) {
        const nfts = await NFT.paginate(filter, options)
        return nfts
    }

    
}

const nftDao = new NftDAO()
module.exports = nftDao