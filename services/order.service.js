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
        try {
            const findByUserId = await userDao.findOneByFilter({_id: userId})
            if (!findByUserId) {
                throw new OrderError({key: 'order_create_invalid_user', params: [userId]})
            }
            const updatedNFTs = await nftDao.queryAllByFilter({_id: {$in: nftIds}})  // get the list nfts to be updated
            await nftDao.updateMany({_id: {$in: nftIds}}, {$set: {status: 'off', price: 0}}) // update status and price
            const updatedNFTIds = updatedNFTs.map((nft) => nft._id)
            const prices = updatedNFTs.map((nft) => nft.price)
            logger.debug('OrderService.createInBatch. updatedNFTIds = ', updatedNFTIds)
            
            const filteredFroms = []
            const filteredNftIds = nftIds.filter((nftId, index) => {
                if (!updatedNFTIds.includes(nftId)) {
                    logger.warn('OrderService.createInBatch. NFT with _id =', nftId + ' is excluded when creating orders in batch')
                    return false
                }
                filteredFroms.push(froms[index])
                return true
            })

            if (filteredNftIds.length != filteredFroms.length || filteredNftIds.length != prices.length || filteredFroms.length != prices.length) {
                throw new OrderError({key: 'order_createInBatch_filter_error'})
            }
            logger.debug('[OrderService.createInBatch] filteredNftIds = ', filteredNftIds)
            logger.debug('OrderService.createInBatch. filteredFroms = ', filteredFroms)
            logger.debug('OrderService.createInBatch. prices = ', prices)
            const savedOrders = await orderDao.createInBatch(userId, filteredNftIds, filteredFroms, prices)
            return savedOrders

        } catch(e) {
            const errMsg = messageHelper.getMessage('order_createInBatch_failed', userId, nftIds, froms, e)
            logger.error(errMsg)
            if (!(e instanceof OrderError)) {
                const err = new OrderError({message: errMsg})
                throw err
            } else {
                throw e
            }  
        }
    }

    async queryOrdersByUserId(userId, page, limit, sortBy) {
        logger.info('OrderService.queryOrdersByUserId')
        try {
            const avaliableNFTs = await nftDao.queryAvailbleNfts()
            const filter = {$and: [{user: userId}, {nftId: {$in: avaliableNFTs.map((nft) => nft._id)}}]}
            logger.debug('OrderService.queryOrdersByUserId. filter = ', filter)
            const options = {page: page, limit: limit, sortBy: sortBy}
            const resultByFilter = await orderDao.queryByPagination(filter, options)
            return {orders: resultByFilter.results, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
        } catch (e) {
            const errMsg = messageHelper.getMessage('order_query_by_userId_failed', userId, e)
            throw new OrderError({message: errMsg})
        }
    }

    async countForUser(userId) {
        logger.info('OrderService.countForUser. userId=', userId)
        try {
            const count = await orderDao.countOrders({user: userId})
            return count
        } catch (e) {
            const errMsg = messageHelper.getMessage('order_count_by_userId_failed', userId, e)
            throw new OrderError({message: errMsg})
        }
    }
}

const orderService = new OrderService()
module.exports = orderService