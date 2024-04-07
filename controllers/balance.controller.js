const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const balanceService = require('../services/balance.service')
const {sendSuccess} = require('../routes/reponseHandler')

class BalanceController {
    async update(req, res, next) {
        logger.info('BalanceController.update. userId =', req.body.userId, ' value=', req.body.value, ' chainId=', req.body.chainId)
        const userId = req.body.userId
        const value = Number(req.body.value)
        const chainId = Number(req.body.chainId)
        try {
            const payload = await balanceService.update(userId, value, chainId)
            sendSuccess(res, messageHelper.getMessage('balance_update_success', userId, value), {balance: payload})
        } catch (e) {
            next(e)
        }
    }

    async queryByUserId(req, res, next) {
        logger.info('BalanceController.queryByUserId. userId =', req.query.userId, ' chainId=', req.query.chainId)
        const userId = req.params.userId
        const chainId = Number(req.query.chainId)
        try {
            const payload = await balanceService.queryByUserId(userId, chainId)
            sendSuccess(res, messageHelper.getMessage('balance_query_success', userId), {balance: payload})
        } catch (e) {
            next(e)
        }
    }
}

const controller = new BalanceController()
module.exports = controller