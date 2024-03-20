const logger = require("../helpers/logger")
const {fullOrderViewDao} = require('../db')

class FullOrderViewService {
    async queryOrdersByUserId(userId, query) {
        logger.info('FullOrderViewService.queryOrdersByUserId')
    }

}

const fullOrderViewService = new FullOrderViewService()
module.exports = fullOrderViewService