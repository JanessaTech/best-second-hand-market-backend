
const mongoose = require('mongoose')
const nftService = require('../../services/nft.service')
const cartService = require('../../services/cart.service')
const {CartError} = require('../../routes/cart/CartErrors')
const config = require('../../config/configuration')

class CartSessionWrapper {
    async add(userId, nftId) {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()

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
            const payload = await cartService.add(userId, nftId, session)
            throw new CartError({key: 'cart_add_failed', params:[userId, nftId, 'for test']})
            await session.commitTransaction()
            return payload
        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            await session.endSession()
        }
    }
}

const cartSessionWrapper = new CartSessionWrapper()
module.exports = cartSessionWrapper