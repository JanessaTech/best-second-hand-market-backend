const logger = require("../helpers/logger")
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const cartDao = require('../dao/cart')

class CartService {
    async add(userId, nftId) {
        logger.info('CartService.add')
        try {
            const cart = {userId: userId, nftId: nftId}
            const savedCart = await cartDao.add(cart)
            return savedCart
        } catch (e) {
            logger.debug('Failed to add a new item to cart. userId =', userId, ' nftId =', nftId)
            throw e
        }
    }

    async remove(id) {
        logger.info('CartService.remove')
        try {
            await cartDao.delete(id)
        } catch (e) {
            throw e
        }
    }

    async queryByUser(userId, page, limit, sortBy) {
        logger.info('CartService.queryByUser. userId = ', userId)
        const filter = {userId: userId}
        const options = {page: page, limit: limit, sortBy: sortBy}
        let cartIds = []
        const resultByFilter = await cartDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            for (const cartItem of resultByFilter.results) {
                cartIds.push(cartItem.nftId)
            }
        }
        return cartIds
    }
}

const cartService = new CartService()
module.exports = cartService