const logger = require("../helpers/logger")
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const cartDao = require('../dao/cart')
const nftDao = require('../dao/nft')
const {chainParser} = require('../config/configParsers')
const nftService = require('../services/nft.service')

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

    async queryByUser(userId) {
        logger.info('CartService.queryByUser. userId = ', userId)
        const filter = {userId: userId}
        let nftIds = []
        const cartItems = await cartDao.queryBy(filter)
        for (const cartItem of cartItems) {
            nftIds.push(cartItem.nftId)
        }
        const nfts = await nftService.queryNFTsByIds(nftIds)
        return nfts
    }
}

const cartService = new CartService()
module.exports = cartService