const logger = require("../helpers/logger")
const orderDao = require('../dao/order')
const nftDao = require('../dao/nft')
const userDao = require('../dao/user')
const {OrderError} = require('../routes/order/OrderErrors')
const messageHelper = require("../helpers/internationaliztion/messageHelper")

class OrderService {
    async create(userId, nftId, from) {
        logger.info('OrderService.create')
        try {
            const findByUserId = await userDao.findOneByFilter({_id: userId})
            if (!findByUserId) {
                throw new OrderError({key: 'order_create_invalid_user', params: [userId]})
            }
            const findByNftId = await nftDao.findOneAndUpdate({_id: nftId}, {price: 0, status: 'off'})
            if (!findByNftId) {
                throw new OrderError({key: 'order_create_invalid_nft', params: [nftId]})
            }
            const savedOrder = await orderDao.create(userId, nftId, from, findByNftId.price)
            return savedOrder
        } catch(e) {
            const errMsg = messageHelper.getMessage('order_create_failed', userId, nftId, from, e)
            logger.error(errMsg)
            if (!(e instanceof OrderError)) {
                const err = new OrderError({message: errMsg})
                throw err
            } else {
                throw e
            }  
        }
    }

    async createInBatch(userId, nftIds, froms) {
        logger.info('OrderService.createInBatch')


    }

    async queryOrdersByUserId(userId, page, limit, sortBy) {
        logger.info('OrderService.queryOrdersByUserId')
        const filter = {userId: userId}
        const options = {page: page, limit: limit, sortBy: sortBy}
        
    }
}

const orderService = new OrderService()
module.exports = orderService