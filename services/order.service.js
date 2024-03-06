const logger = require("../helpers/logger")
const orderDao = require('../dao/order')
const nftDao = require('../dao/nft')
const userDao = require('../dao/user')

class OrderService {
    async add(userId, nftId, from) {
        logger.info('OrderService.add')
        try {
            const findByNftId = await nftDao.findOneByFilter({_id: nftId})
            const findByUserId = await userDao.findOneBy({_id: userId})
        }catch(e) {

        }

    }

    async addInBatch() {

    }
}

const orderService = new OrderService()
module.exports = orderService