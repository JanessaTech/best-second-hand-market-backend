const logger = require("../helpers/logger")
const {balanceDao, userDao} = require('../db')
const {BalanceError} = require('../routes/balance/BalanceErrors')
const {getExchange} = require('../helpers/chainHelper')

class BalanceService {
    async update(userId, value, chainId) {
        logger.info('BalanceService.update')
        try {
            const exchange = getExchange(chainId)
            logger.debug('BalanceService.update. exchange=', exchange, ' for chainId ', chainId)
            const user = await userDao.findOneByFilter({_id: userId})
            if (!user) {
                throw new BalanceError({key: 'user_not_found_id', params:[userId], code: 404})
            }
            const savedBalance = await balanceDao.findOneAndUpdate(userId, value)
            return savedBalance?.value
        } catch (e) {
            if (!(e instanceof BalanceError)) {
                throw new BalanceError({key: 'balance_update_failed', userId, value, chainId, e})
            } else {
                throw e
            }
        } 
    }

    async queryByUserId(userId, chainId) {
        logger.info('BalanceService.queryByUserId')
        try {
            const exchange = getExchange(chainId)
            logger.debug('BalanceService.queryByUserId. exchange=', exchange, ' for chainId ', chainId)
            const user = await userDao.findOneByFilter({_id: userId})
            if (!user) {
                throw new BalanceError({key: 'user_not_found_id', params:[userId], code: 404})
            }
            const savedBalance = await balanceDao.findOneAndUpdate(userId, 0)
            return savedBalance?.value
        } catch (e) {
            if (!(e instanceof BalanceError)) {
                throw new BalanceError({key: 'balance_query_failed', userId, chainId, e})
            } else {
                throw e
            }
        } 
    }
}

const balanceService = new BalanceService()
module.exports = balanceService