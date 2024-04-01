const logger = require("../helpers/logger")
const {orderViewDao, userDao} = require('../db')
const {OrderViewError} = require('../routes/order/OrderErrors')
const {chainParser} = require('../config/configParsers')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const {convertToURL} = require('../helpers/httpHelper')

class OrderViewService {

    async #addExtraInfo(order) {
        const chain = chainParser.getChain(order.chainId)
        const chainName = chain.chainName
        const owner = await chainParser.getOwner(order.chainId, order.address, order.tokenId)
        const user = await userDao.findOneByFilter({address: owner})
        if (!user) {
            const errMsg = messageHelper.getMessage('user_not_found_address', owner)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new OrderViewError({message: errMsg, code: 400})
        }
        const tokenStandard = chainParser.getTokenStandard(order.chainId, order.address)

        let jsonOrder = order.toJSON()
        jsonOrder.owner = user.toJSON()
        jsonOrder.uri = order.uri
        jsonOrder.url = convertToURL(order.uri)
        jsonOrder.chainName = chainName
        jsonOrder.tokenStandard = tokenStandard
        
        return jsonOrder
    }

    async #addExtraInfoToRawOrders(rawOrders) {
        let orders = []
        for(const rawOrder of rawOrders) {
            try {
                const fullOrder = await this.#addExtraInfo(rawOrder)
                orders.push(fullOrder)
            } catch (e) {
                logger.error(messageHelper.getMessage('order_addextra_failed', rawOrder._id, e)) // the code should not hit here. If that happened, fix it to make it not happen again
            }
        }
        return orders
    }
    
    async queryOrdersByUserId(userId, query) {
        logger.info('OrderViewService.queryOrdersByUserId')
        const user = await userDao.findOneByFilter({_id: userId})
        if (!user) {
            throw new OrderViewError({key: 'user_not_found_id', params:[userId], code: 404})
        }
        const filter = await chainParser.getFilterByChains({...query})
        const options = {page: query?.page, limit: query?.limit, sortBy: query?.sortBy}
        let orders = []
        const resultByFilter = await orderViewDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            orders = await this.#addExtraInfoToRawOrders(resultByFilter.results)
        }
        logger.info(`${orders.length} orders are returned`)
        return {orders: orders, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

}

const orderViewService = new OrderViewService()
module.exports = orderViewService