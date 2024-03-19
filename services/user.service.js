const logger = require("../helpers/logger");
const {UserError} = require("../routes/user/UserErrors");
const {userDao} = require('../db');
const messageHelper = require("../helpers/internationaliztion/messageHelper");

class UserService {
    async register(user) {
        logger.info('UserService.register...')
        try {
            const byName = await userDao.findOneByFilter({name: user.name})
            if (byName) {
                throw new UserError({key: 'user_register_duplication_name', params:[user.name], code: 400})
            }
            const byAddress = await userDao.findOneByFilter({address: user.address})
            if (byAddress) {
                throw new UserError({key: 'user_register_duplication_address', params:[user.address], code: 400})
            }
            return await userDao.create(user)
        } catch(e) {
            logger.error('Failed to register the user', user)
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
            logger.error('Failed to login by address =', address)
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
            logger.error('Failed to logout by address =', address)
            throw e
        }
    }

    async update(id, name, intro, profile) {
        logger.info('UserService.update')
        try {
            const filter = {_id: id}
            const update = {}
            if (name) {
                update.name = name
            }
            if (intro) {
                update.intro = intro
            }
            if (profile) {
                update.profile = profile
            }
            const user = await userDao.findOneAndUpdate(filter, update)
            if (!user) {
                throw new UserError({key: 'user_not_found_id', params:[id], code: 404})
            }
            return user
        } catch(e) {
            const errMsg  = messageHelper.getMessage('user_update_failed', id, name, intro, e)
            logger.error(errMsg)
            throw new UserError({message: errMsg})
        }
    }

    async findUserByAddress(address) {
        logger.info('UserService.findUserByAddress')
        try {
            const user = await userDao.findOneByFilter({address: address})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch (e) {
            logger.error('Failed to find user by address ', address)
            throw e
        }
    }

    async findUserById(id) {
        logger.info('UserService.findUserById. id=', id)
        try {
            const user = await userDao.findOneByFilter({_id: id})
            if (!user) {
                throw new UserError({key: 'user_not_found_id', params:[id], code: 404})
            }
            return user
        } catch (e) {
            logger.error('Failed to find user by id ', id)
            throw e
        }
    }

}

const userService = new UserService()
module.exports = userService