const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const cartService = require('../services/cart.service')
const {sendSuccess} = require('../helpers/reponseHandler')

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
     * Get the list of nfts in cart for a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryByUser(req, res, next) {
        logger.info('CartController.queryByUser. userId = ', req.params.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy)
        try {
            const userId = req.params.userId
            const page = req.query.page
            const limit = req.query.limit
            const sortBy = req.query.sortBy
            const payload = await cartService.queryByUser(userId, page, limit, sortBy)
            sendSuccess(res, messageHelper.getMessage('cart_query_user', userId), {nftIds: payload})
        } catch (e) {
            next(e)
        }
    }
}

const controller = new CartController()
module.exports = controller