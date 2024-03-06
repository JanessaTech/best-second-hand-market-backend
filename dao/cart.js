const logger = require('../helpers/logger')
const {Cart} = require('../models')
const {CartError} = require('../routes/cart/CartErrors')
const messageHelper = require('../helpers/internationaliztion/messageHelper')

class CartDAO {
    async add(cart) {
        try {
            const cartDao = new Cart({
                userId: cart.userId,
                nftId: cart.nftId
            })
            const savedCart = await cartDao.save()
            logger.debug('CartDAO.add. a new cart item is added successfully.', savedCart)
            return savedCart
        } catch (err) {
            logger.error('Failed to save cart item due to ', err)
            throw new CartError({key: 'cart_add_validiation_failed', params:[cart.userId, cart.nftId, err], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async delete(id) {
        try {
            await Cart.findByIdAndDelete({_id: id})
        } catch (err) {
            const errMsg = messageHelper.getMessage('cart_delete_failed', id, err)
            logger.error(errMsg)
            throw new CartError({message: errMsg, code: 400})
        }
    }

    async queryAllByFilter(filter) {
        const carts = await Cart.find(filter)
        return carts
    }

    async queryByPagination(filter, options) {
        const carts = await Cart.paginate(filter, options)
        return carts
    }
}

const cartDao = new CartDAO()
module.exports = cartDao