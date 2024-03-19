const logger = require('../../helpers/logger')
const {Order} = require('../models')
const {OrderError} = require('../../routes/order/OrderErrors')

class OrderDAO {
    async create(userId, nftId, from, price) {
        try {
            const orderDao = new Order({
                user: userId,
                nftId: nftId,
                from: from,
                price: price
            })
            const savedOrder = await orderDao.save()
            logger.debug('OrderDAO.create. a new order is created successfully.', savedOrder)
            return savedOrder
        } catch (err) {
            logger.error('Failed to create a new order due to ', err)
            throw new OrderError({key: 'order_create_validiation_failed', params:[userId, nftId, from, err], errors: err.errors ? err.errors : err.message, code: 400})
        }

    }

    async createInBatch(userId, nftIds, froms, prices) {
        const orders = []
        for (let i = 0; i < nftIds.length; i++) {
            orders.push({user: userId, nftId: nftIds[i], from: froms[i], price: prices[i]})
        }
        try {
            const res = await Order.insertMany(orders, { ordered: false, rawResult: false})
            logger.debug('Executed insertMany successfully for userId ', userId)
            return res
        } catch (err) {
            throw err
        }
    }

    async findOneByFilter(filter) {
        const order = await Order.findOne(filter)
        return order
    }

    async queryAllByFilter(filter) {
        const orders = await Order.find(filter)
        return orders
    }

    async queryByPagination(filter, options) {
        const orders = await Order.paginate(filter, options)
        return orders
    }

    async countOrders(filter) {
        const count = await Order.countDocuments(filter)
        return count
    }
}

const orderDao = new OrderDAO()
module.exports = orderDao