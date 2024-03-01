const logger = require("../helpers/logger");
const {UserError} = require("../routes/user/UserErrors");
const userDao = require('../dao/user')

class UserService {
    async register(user) {
        logger.info('UserService.register...')
        try {
            const byName = await userDao.findOneBy({name: user.name})
            if (byName) {
                throw new UserError({key: 'user_register_duplication_name', params:[user.name], code: 400})
            }
            const byAddress = await userDao.findOneBy({address: user.address})
            if (byAddress) {
                throw new UserError({key: 'user_register_duplication_address', params:[user.address], code: 400})
            }
            return await userDao.create(user)
        } catch(e) {
            logger.debug('Failed to register the user', user)
            throw e
        }
    }

    async findUserByAddress(address) {
        logger.info('UserService.findUserByAddress')
        try {
            const user = await userDao.findOneBy({address: address})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch (e) {
            logger.debug('Failed to find user by address ', address)
            throw e
        }
    }

    async loginByAddress(address) {
        logger.info('UserService.login')
        try {
            const user = await userDao.findOneAndUpdate({address: address}, {loginTime: new Date()})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch(e) {
            logger.debug('Failed to login by address =', address)
            throw e
        }
    }

    async logoutByAddress(address) {
        try {
            const user = await userDao.findOneAndUpdate({address: address}, {logoutTime: new Date()})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch(e) {
            logger.debug('Failed to logout by address =', address)
            throw e
        }
    }

}

const userService = new UserService()
module.exports = userService