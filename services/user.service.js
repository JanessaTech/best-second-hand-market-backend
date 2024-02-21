const logger = require("../helpers/logger");
const {UserError} = require("../routes/user/UserErrors");
const userDao = require('../dao/user')

class UserService {
    async register(user) {
        logger.info('UserService.register...')
        try {
            const byName = await userDao.findByName(user.name)
            if (byName) {
                throw new UserError({key: 'user_register_duplication_name', params:[user.name], code: 400})
            }
            const byAddress = await userDao.findByAddress(user.address)
            if (byAddress) {
                throw new UserError({key: 'user_register_duplication_address', params:[user.address], code: 400})
            }
            return await userDao.create(user)
        } catch(e) {
            logger.debug('Failed to register the user', user)
            throw e
        }
    }

    async getUserByAddress(address) {
        logger.info('UserService.getUserByAddress')
        try {
            const user = await userDao.findByAddress(address)
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch (e) {
            logger.debug('Failed to get user by address ', address)
            throw e
        }
    }

    async loginByAddress(address) {
        logger.info('UserService.login')
        try {
            const user = await userDao.findByAddressAndUpdateLoginTime(address)
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch(e) {
            logger.debug('Failed to login by address =', address)
            throw e
        }
    }

}

const userService = new UserService()
module.exports = userService