const logger = require("../helpers/logger")
const {cartDao} = require('../db')

class CartService {
    async add(userId, nftId, session) {
        logger.info('CartService.add')
        try {
            const cart = {userId: userId, nftId: nftId}
            const savedCart = await cartDao.add(cart, session)
            return savedCart
        } catch (e) {
            logger.error('Failed to add a new item to cart. userId =', userId, ' nftId =', nftId)
            throw e
        }
    }

    async remove(userId, nftIds) {
        logger.info('CartService.remove')
        try {
            await cartDao.delete(userId, nftIds)
        } catch (e) {
            throw e
        }
    }

    async queryByUser(userId) {
        logger.info('CartService.queryByUser. userId = ', userId)
        const filter = {userId: userId}
        let nftIds = []
        const cartItems = await cartDao.queryAllByFilter(filter)
        for (const cartItem of cartItems) {
            nftIds.push(cartItem.nftId)
        }
        return nftIds
    }
}

const cartService = new CartService()
module.exports = cartService