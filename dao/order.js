const logger = require('../helpers/logger')
const {Order} = require('../models')
const {OrderError} = require('../routes/order/OrderErrors')


class OrderDAO {
    async create(userId, nftId, from, price) {
        try {
            const orderDao = new Order({
                userId: userId,
                nftId: nftId,
                from: from,
                price: price
            })
            const savedOrder = await orderDao.save().then((saved) => saved.populate('userId'))
            logger.debug('OrderDAO.create. a new order is created successfully.', savedOrder)
            return savedOrder
        } catch (err) {
            logger.error('Failed to create a new order due to ', err)
            throw new OrderError({key: 'order_create_validiation_failed', params:[userId, nftId, from,  err], errors: err.errors ? err.errors : err.message, code: 400})
        }

    }

    async createInBatch() {
        
    }

    async findOneByFilter(filter) {
        const order = await Order.findOne(filter)
        return order
    }

    async queryByPagination(filter, options) {
        //options.populate = 'userId:id name,replies:id userId:userId|id name createdAt'
        const orders = await Order.paginate(filter, options)
        return orders
    }
}

const orderDao = new OrderDAO()
module.exports = orderDao