const logger = require('../helpers/logger')
const {sendSuccess} = require('../routes/reponseHandler')
const nftService = require('../services/nft.service')
const cartService = require('../services/cart.service')
const likeService = require('../services/like.service')
const {NftError} = require('../routes/nft/NftErrors')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const httpHelper = require('../helpers/httpHelper')

class NFTcontroller {

    /**
     * Mint a nft
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async mint(req, res, next) {
        logger.info('NFTcontroller.mint')
        const {tokenId, ipfs, chainId, address, status, price} = req.body
        try {
            const nft = {
                tokenId : tokenId,
                ipfs : ipfs,
                chainId: chainId,
                address: address,
                status: status,
                price: price
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
        logger.info('NFTcontroller.update')
        try {
            const updates = {
                _id: req.body.id,
                price: req.body.price,
                status: req.body.status
            }
            const payload = await nftService.update(updates)
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
    async findNFTById(req, res, next) {
        logger.info('NFTcontroller.findNFTById. id=', req.params.id, 'userId =', req.query.userId)
        const id = Number(req.params.id)
        const userId = req.query.userId
        try {
            const payload = await nftService.findNFTById(id, true)
            const nftIdsInCart = userId ? await cartService.queryByUser(userId): []
            payload.inCart = userId ? nftIdsInCart.includes(id) : undefined
            payload.isLike = userId ? await likeService.isLike(userId, id): undefined
            payload.likes = await likeService.countLike(id)
            sendSuccess(res, messageHelper.getMessage('nft_by_id_success', id), {nft: payload})
        } catch (e) {
            if (!(e instanceof NftError)) {
                const err = new NftError({key:'nft_by_id_failed', params: [id, userId, e]})
                next(err)
            } else {
                next(e)
            } 
        }
    }

    /**
     * Get the list of nfts by conditions
     * The method is used when wallet is not connected
     */
    async queryNFTs(req, res, next) {
        logger.info('NFTcontroller.queryNFTs. userId =', req.query.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy, ' chainId =', req.query.chainId, ' status=', req.query.status, ' category =', req.query.category, ' prices =', req.query.prices)
        const userId = req.query.userId
        const page = req.query.page
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        const chainId = req.query.chainId
        const status = req.query.status
        const category = req.query.category
        const prices = req.query.prices
        const title = req.query.title
        const query = httpHelper.getQueryObject({page, limit, sortBy, chainId, status, category, prices, title})
        try {
            const nftsWithPagination = await nftService.queryNFTs(query)
            const nftIdsInCart = userId ? await cartService.queryByUser(userId): []
            const nftsWithCartInfo = nftsWithPagination.nfts.map((nft) => {
                nft.inCart = userId ? nftIdsInCart.includes(nft.id) : undefined
                return nft
            })
            const payload = {...nftsWithPagination, nfts: nftsWithCartInfo}
            sendSuccess(res, messageHelper.getMessage('nft_query_all_success', userId), payload)
        } catch (e) {
            if (!(e instanceof NftError)) {
                const err = new NftError({key:'nft_query_all_failed', params: [userId, e]})
                next(err)
            } else {
                next(e)
            } 
        }
    }

    /**
     * Query the list of nfts for an user based on conditions
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryNFTsForUser(req, res, next) {
        logger.info('NFTcontroller.queryNFTsForUser userId =', req.params.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy, ' chainId =', req.query.chainId, ' status =', req.query.status, ' category =', req.query.category, ' prices =', req.query.prices)
        const userId = Number(req.params.userId)
        const page = req.query.page 
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        const chainId = req.query.chainId
        const status = req.query.status
        const category = req.query.category
        const prices = req.query.prices
        const query = httpHelper.getQueryObject({page, limit, sortBy, chainId, status, category, prices})
        try {
            const payload = await nftService.queryNFTsForUser(userId, query)
            sendSuccess(res, messageHelper.getMessage('nft_query_for_user_success', userId), payload)
        } catch(e) {
            next(e)
        }
    }

    async queryFavoriteNFTsForUser(req, res, next) {
        logger.info('NFTcontroller.queryFavoriteNFTsForUser userId =', req.params.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy, ' chainId =', req.query.chainId, ' status =', req.query.status, ' category =', req.query.category, ' prices =', req.query.prices)
        const userId = Number(req.params.userId)
        const page = req.query.page 
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        const chainId = req.query.chainId
        const status = req.query.status
        const category = req.query.category
        const prices = req.query.prices
        try {
            const query = httpHelper.getQueryObject({page, limit, sortBy, chainId, status, category, prices})
            const payload = await nftService.queryFavoriteNFTsForUser(userId, query)
            sendSuccess(res, messageHelper.getMessage('nft_query_favorite_for_user_success', userId), payload)
        } catch(e) {
            next(e)
        }
    }
}

const controller = new NFTcontroller()
module.exports = controller