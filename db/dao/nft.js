const logger = require('../../helpers/logger')
const {NFT} = require('../models')
const {NftError} = require('../../routes/nft/NftErrors')
const {chainParser} = require('../../config/configParsers')

class NftDAO {
    async create({tokenId, ipfs, chainId, address, status, price}) {
        try {
            const nftDao = new NFT({
                tokenId: tokenId,
                ipfs: ipfs,
                chainId: chainId,
                address: address, 
                status: status,
                price: price
            })
            const savedNft = await nftDao.save()
            logger.debug('NftDAO.create. A new nft record is saved successfully', savedNft)
            return savedNft
        } catch (err) {
            logger.error('Failed to create nft due to ', err)
            throw new NftError({key: 'nft_save_validation_failed', params: [chainId, address, tokenId], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async updateMany(filter, update, option = {upsert: false}) {
        try {
            const result  = await NFT.updateMany(filter, update, option)
            return result
        } catch (err) {
            logger.error('Failed to updateMany due to', err)
            throw new NftError({key: 'nft_updateMany_failed', params:[JSON.stringify(filter), JSON.stringify(update), JSON.stringify(option), err]})
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

    async findOneAndUpdate(filter, update, option = {new: false, upsert: false}) {
        const nft = await NFT.findOneAndUpdate(filter, update, option)
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

    /**
     * Query the list of nfts based on the config.chains in config.common.js.
     * We should make sure the nfts returned are the valid ones which can interact with smart contract
     * 
     */
    async queryAvailbleNfts() {
        logger.debug('NftDAO.queryAvailbleNfts.')
        const filter = await chainParser.getFilterByChains({})
        const nfts = await NFT.find(filter)
        return nfts
    }

    async countNfts(filter) {
        const count = await NFT.countDocuments(filter)
        return count
    }
}

const nftDao = new NftDAO()
module.exports = nftDao