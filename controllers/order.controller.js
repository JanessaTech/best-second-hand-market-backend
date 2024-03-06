const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const {sendSuccess} = require('../helpers/reponseHandler')
const orderService = require('../services/order.service')
const nftService = require('../services/nft.service')
const {OrderError} = require('../routes/order/OrderErrors')

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
            
            const order = await orderService.create(userId, nftId, from)
            const nft = await nftService.findNFTById(nftId)
            const payload = {...nft, ...order.toJSON()}
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
        const nftIds = req.body.nftIds
        const froms = req.body.froms
        try {
            const payload = await orderService.addInBatch()
            sendSuccess(res, messageHelper.getMessage('order_createInBatch_success', userId, nftIds, froms), {prders: payload})
        } catch(e) {
            next(e)
        }
    }
}

const controller = new OrderController()
module.exports = controller