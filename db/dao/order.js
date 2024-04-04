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
        // in order to insert successfully, we need filter out pairs of nftId&from which are already inserted
        // newOrders are the ones we need to insert into db finally
        const ands = []
        for (let i = 0; i < nftIds.length; i++) {
            ands.push({$and: [{nftId: nftIds[i]}, {from: froms[i]}]})
        }
        const query = {$or: ands}
        const savedNFTs = await Order.find(query)
        logger.debug('OrderDAO.createInBatch. query =', query)
        const pairs = new Set()
        savedNFTs.forEach((nft) => pairs.add(`${nft.from}-${nft.nftId}`))
        logger.debug('OrderDAO.createInBatch. pairs=', pairs)
        const newOrders = []
        for (let i = 0; i < nftIds.length; i++) {
            const pair = `${froms[i]}-${nftIds[i]}`
            if (!pairs.has(pair)) {
                newOrders.push({user: userId, nftId: nftIds[i], from: froms[i], price: prices[i]})
            }
        }
        logger.debug('OrderDAO.createInBatch. newOrders=', newOrders)
        try {
            const ordersInserted = await Order.insertMany(newOrders, { ordered: false, rawResult: false})
            logger.debug('OrderDAO.createInBatch. Order.insertMany. orders inserted = ', ordersInserted)
            logger.debug('OrderDAO.createInBatch. Executed insertMany successfully for userId ', userId)
            return ordersInserted
        } catch (err) {
            logger.debug('OrderDAO.createInBatch. Failed to orders by executing insertMany for order due to ', err)
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