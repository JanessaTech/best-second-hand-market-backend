const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const cartService = require('../services/cart.service')
const nftService = require('../services/nft.service')
const {sendSuccess} = require('../routes/reponseHandler')
const {CartError} = require('../routes/cart/CartErrors')
const cartSessionWrapper = require('./sessionWrappers/cartSessionWrapper')
const config = require('../config/configuration')

class CartController {
    /**
     * Put a nft to cart for a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async add(req, res, next) {
        logger.info('CartController.add. userId =', req.body.userId, ' nftId =', req.body.nftId)
        const userId = Number(req.body.userId)
        const nftId = Number(req.body.nftId)
        try {
            
            const nft = await nftService.findNFTById(nftId)
            const nftIds = await cartService.queryByUser(userId)
            if (nft.owner.id === userId) {
                throw new CartError({key: 'cart_add_own_failed', params: [nftId, userId]})
            }
            if (nftIds.includes(nftId)) {
                throw new CartError({key: 'cart_already_added_failed', params: [nftId, userId]})
            }
            if (nftIds && nftIds.length >= config.limits.cartlimit) {
                throw new CartError({key: 'cart_limit_reached', params: [nftId, userId, config.limits.cartlimit]})
            }
            if (nft.status === 'off') {
                throw new CartError({key: 'cart_nft_status_off', params: [nftId]})
            }
            const payload = await cartService.add(userId, nftId)
            //throw new CartError({key: 'cart_add_failed', params:[userId, nftId, 'for test']})
            //const payload = await cartSessionWrapper.add(userId, nftId)
            sendSuccess(res, messageHelper.getMessage('cart_add_success', userId, nftId), {cart: payload})
        } catch(e) {
            if (!(e instanceof CartError)) {
                const err = new CartError({key: 'cart_add_failed', params:[userId, nftId, e]})
                next(err)
            } else {
                next(e)
            }  
        }
    }

    /**
     * Remove a nft from cart for a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async remove(req, res, next) {
        logger.info('CartController.remove. userId =', req.query.userId, 'nftIds=',  req.query.nftId)
        try {
            const userId = req.query.userId
            const nftIds = req.query.nftId
            cartService.remove(userId, nftIds)
            sendSuccess(res, messageHelper.getMessage('cart_remove_success', userId, nftIds))
        } catch(e) {
            next(e)
        }
    }

    /**
     * Check if a nft is put into the cart for an user
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
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
            if (!(e instanceof CartError)) {
                const err = new CartError({key: 'cart_isInCart_failed', params: [userId, nftId, e]})
                next(err)
            } else {
                next(e)
            }
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
            if (!(e instanceof CartError)) {
                const err = new CartError({key: 'cart_query_user_failed', params: [userId, e]})
                next(err)
            } else {
                next(e)
            }
        }
    }
}

const controller = new CartController()
module.exports = controller