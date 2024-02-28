const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const nftService = require('../services/nft.service')
const messageHelper = require('../helpers/internationaliztion/messageHelper')

class NFTcontroller {

    /**
     * Mint a nft
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async mint(req, res, next) {
        logger.info('NFTcontroller.mint')
        try {
            const nft = {
                tokenId : req.body.tokenId,
                title : req.body.title,
                category: req.body.category,
                chainId: req.body.chainId,
                address: req.body.address,
                description: req.body.description,
                status: req.body.status,
                price: req.body.price
            }
            const payload = await nftService.mint(nft)
            sendSuccess(res, messageHelper.getMessage('nft_mint_success', payload.tokenId), {nft: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Update status or price for a nft by an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {
        logger.info('NFTcontroller.updateNft')
        try {
            const update = {
                _id: req.body.id,
                price: req.body.price,
                status: req.body.status
            }
            const payload = await nftService.update(update)
            sendSuccess(res, messageHelper.getMessage('nft_update_success', payload.id), {nft: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Get a nft by id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getNftById(req, res, next) {
        logger.info('NFTcontroller.getNftById. id=', req.params.id)
        const id = req.params.id
        try {
            const payload = await nftService.getNFTById(id)
            sendSuccess(res, messageHelper.getMessage('nft_by_id_success', id), {nft: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Get the list of nfts by conditions
     * The method is used when wallet is not connected
     */
    async queryNFTs(req, res, next) {
        logger.info('NFTcontroller.queryNFTs. userId =', req.query.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy)
        const userId = req.query.userId
        const page = req.query.page
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        try {
            const payload = await nftService.queryNFTs(userId, page, limit, sortBy)
            sendSuccess(res, messageHelper.getMessage('nft_query_all_success', userId), payload)
        } catch (e) {
            next(e)
        }
    }

    /**
     * Query the list of nfts for an user based on conditions
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryNftsForUser(req, res, next) {
        logger.info('NFTcontroller.queryNftsForUser userId =', req.query.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy)
        const userId = req.params.userId
        const page = req.query.page
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        try {
            const payload = await nftService.queryNftsForUser(userId, page, limit, sortBy)
            sendSuccess(res, messageHelper.getMessage('nft_query_for_user_success', userId), payload)
        }catch(e) {
            next(e)
        }
    }
     
}

const controller = new NFTcontroller()
module.exports = controller