const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const cartService = require('../services/cart.service')
const nftService = require('../services/nft.service')
const {sendSuccess} = require('../helpers/reponseHandler')
const {CartError} = require('../routes/cart/CartErrors')

class CartController {
    /**
     * Put a nft to cart for a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async add(req, res, next) {
        logger.info('CartController.add. userId =', req.body.userId, ' nftId =', req.body.nftId)
        try {
            const userId = req.body.userId
            const nftId = req.body.nftId
            const payload = await cartService.add(userId, nftId)
            sendSuccess(res, messageHelper.getMessage('cart_add_success', userId, nftId), {cart: payload})
        } catch(e) {
            next(e)
        }
    }

    /**
     * Remove a list of nfts from cart for a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async remove(req, res, next) {
        logger.info('CartController.remove. id =', req.params.id)
        try {
            const id = req.params.id
            cartService.remove(id)
            sendSuccess(res, messageHelper.getMessage('cart_remove_success', id))
        } catch(e) {
            next(e)
        }
    }

    /**
     * Check if a nft is put into the cart for an user
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async isInCart(req, res, next) {
        logger.info('CartController.isInCart. userId =', req.query.userId, 'nftId =', req.query.nftId)
        const userId = Number(req.query.userId)
        const nftId = Number(req.query.nftId)
        try {
            const nftIds = await cartService.queryByUser(userId)
            const isInCart = nftIds.includes(nftId)
            sendSuccess(res, messageHelper.getMessage('cart_isInCart_success', userId, nftId), {inCart: isInCart})
        } catch (e) {
            const err = new CartError({key: 'cart_isInCart_failed', params: [userId, nftId, e]})
            next(err)
        }
    }

    /**
     * Get the list of nfts in cart for a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryByUser(req, res, next) {
        logger.info('CartController.queryByUser. userId = ', req.params.userId)
        const userId = req.params.userId
        try {
            const nftIds = await cartService.queryByUser(userId)
            const payload = await nftService.queryNFTsByIds(nftIds)
            sendSuccess(res, messageHelper.getMessage('cart_query_user', userId), {nfts: payload.filter((nft) => nft.owner.id != userId)}) // the nfts belonging to the user with userId are filtered out
        } catch (e) {
            const err = new CartError({key: 'cart_query_user_failed', params: [userId, e]})
            next(err)
        }
    }
}

const controller = new CartController()
module.exports = controller