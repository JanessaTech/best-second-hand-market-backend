
const {User} = require('../db')
const logger = require('../helpers/logger')
const {UserError} = require('../routes/user/UserErrors')

class UserDAO {
    async create(user) {
        try {
            const userDao = new User({
                name: user.name,
                address: user.address,
                intro: user.intro
            })
            const savedUser = await userDao.save()
            logger.debug('UserDAO.create. A new user is saved successfully', savedUser)
            return savedUser
        } catch (err) {
            logger.debug('Failed to save user due to ', err)
            throw new UserError({key: 'user_register_validiation_failed', params:[user.name], errors: err.errors ? err.errors : err.message, code: 400})
        } 
    }

    async findByName(name) {
        const user = await User.findOne({name: name})
        return user 
    }

    async findByAddress(address) {
        const user = await User.findOne({address: address})
        return user 
    }

    async findByAddressAndUpdateLoginTime(address) {
        const filter = {address: address}
        const update = {loginTime: new Date()}
        try {
            const user = await User.findOneAndUpdate(filter, update, {new: true})
            return user
        } catch (err) {
            logger.debug('Failed to update loginTime due to ', err)
            throw e
        }
    }

    async findByAddressAndUpdateLogoutTime(address) {
        const filter = {address: address}
        const update = {logoutTime: new Date()}
        try {
            const user = await User.findOneAndUpdate(filter, update, {new: true})
            return user
        } catch (err) {
            logger.debug('Failed to update logoutTime due to ', err)
            throw e
        }
    }
}

const userDAO = new UserDAO()
module.exports = userDAO