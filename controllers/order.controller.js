const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const {sendSuccess} = require('../routes/reponseHandler')
const orderService = require('../services/order.service')
const orderViewService = require('../services/order.view.service')
const {OrderError} = require('../routes/order/OrderErrors')
const httpHelper = require('../helpers/httpHelper')


function merge(nfts, orders){
    logger.debug('in #merge')
    const merged = []
    for (const order of orders) {
        for (const nft of nfts) {
            if (order.nftId === nft.id) {
                merged.push({...nft, ...order.toJSON()})
            }
        }
    }
    return merged
}

class OrderController {
    /**
     * Add an order once a nft is bought successfully by an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async create(req, res, next) {
        logger.info('OrderController.create. userId=', req.body.userId, 'nftId=',req.body.nftId, 'from =',req.body.from)
        const userId = req.body.userId
        const nftId = req.body.nftId
        const from = req.body.from
        try {
            const payload = await orderService.create(userId, nftId, from)
            sendSuccess(res, messageHelper.getMessage('order_create_success', userId, nftId, from), {order: payload})
        } catch(e) {
            if (!(e instanceof OrderError)) {
                const err =  new OrderError({key: 'order_create_failed', params:[userId, nftId, from, e]})
                next(err)
            } else {
                next(e)
            }   
        }
    }
    
    /**
     * Add orders once the list of nfts were bought successfully by an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createInBatch(req, res, next) {
        logger.info('OrderController.createInBatch. userId=', req.body.userId, 'nftIds=',req.body.nftIds, 'froms =',req.body.froms)
        const userId = req.body.userId
        const nftIds = req.body.nftIds.map((nftId) => Number(nftId))
        const froms = req.body.froms
        try {
            if (nftIds.length !== froms.length) {
                throw new OrderError({key:'order_createInBatch_invalid_arrays'})
            }
            const payload = await orderService.createInBatch(userId, nftIds, froms)
            sendSuccess(res, messageHelper.getMessage('order_createInBatch_success', userId, nftIds, froms), {orders: payload})
        } catch(e) {
            next(e)
        }
    }

    async queryOrdersByUserId(req, res, next) {
        logger.info('OrderController.queryOrdersByUserId userId =', req.params.userId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy, ' chainId =', req.query.chainId, ' status =', req.query.status, ' category =', req.query.category, ' prices =', req.query.prices)
        const userId = Number(req.params.userId)
        const page = req.query.page 
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        const chainId = req.query.chainId
        const status = req.query.status
        const category = req.query.category
        const prices = req.query.prices
        const query = httpHelper.getQueryObject({page, limit, sortBy, chainId, status, category, prices})
        try {
            const payload = await orderViewService.queryOrdersByUserId(userId, query)
            sendSuccess(res, messageHelper.getMessage('order_query_success', userId), payload)
        } catch(e) {
            next(e)
        }
    }
}

const controller = new OrderController()
module.exports = controller