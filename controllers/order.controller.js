const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const {sendSuccess} = require('../helpers/reponseHandler')
const orderService = require('../services/order.service')

class OrderController {
    /**
     * Add an order once a nft is bought successfully by an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async add(req, res, next) {
        logger.info('OrderController.add. userId=', req.body.userId, 'nftId=',req.body.nftId, 'from =',req.body.from)
        const userId = req.body.userId
        const nftId = req.body.nftId
        const from = req.body.from
        try {
            const payload = await orderService.add(userId, nftId, from)
            sendSuccess(res, messageHelper.getMessage('order_add_success', userId, nftId, from), {order: payload})
        } catch(e) {
            next(e)
        }
    }
    
    /**
     * Add orders once the list of nfts were bought successfully by an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async addInBatch(req, res, next) {
        logger.info('OrderController.addInBatch. userId=', req.body.userId, 'nftIds=',req.body.nftIds, 'froms =',req.body.froms)
        const userId = req.body.userId
        const nftIds = req.body.nftIds
        const froms = req.body.froms
        try {
            const payload = await orderService.addInBatch()
            sendSuccess(res, messageHelper.getMessage('order_addInBatch_success', userId, nftIds, froms), {prders: payload})
        } catch(e) {
            next(e)
        }
    }
}

const controller = new OrderController()
module.exports = controller