const logger = require('../../helpers/logger')
const {Balance, } = require('../models')
const {BalanceError} = require('../../routes/balance/BalanceErrors')

class BalanceDAO {
    async findOneAndUpdate(userId, value) {
        try {
            const savedBalance = await Balance.findOneAndUpdate({userId: userId}, {$inc: {value: value}}, { new: true, upsert: true })
            logger.debug('BalanceDAO.findOneAndUpdate.  a balance item is findOneAndUpdated successfully. userId=', userId)
            return savedBalance
        } catch (err) {
            logger.error('Failed to findOneAndUpdate a balance item due to ', err)
            throw new BalanceError({key: 'balance_findOneAndUpdate_validiation_failed', params:[userId, err], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }
}

const balanceDao = new BalanceDAO()
module.exports = balanceDao