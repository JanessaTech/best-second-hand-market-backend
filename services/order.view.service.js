const logger = require("../helpers/logger")
const {orderViewDao} = require('../db')
const {OrderViewError} = require('../routes/order/OrderErrors')
const {chainParser} = require('../config/configParsers')

class OrderViewService {
    async #addExtraInfoToRawNFTs(rawNfts) {

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
            orders = await this.#addExtraInfoToRawNFTs(resultByFilter.results)
        }
        logger.info(`${orders.length} orders are returned`)
        return {orders: orders, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

}

const orderViewService = new OrderViewService()
module.exports = orderViewService