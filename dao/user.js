const {User} = require('../models')
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

    async findOneAndUpdate(filter, update) {
        try {
            const user = await User.findOneAndUpdate(filter, update, {new: true})
            return user
        } catch (err) {
            logger.debug('Failed to update due to ', err)
            throw e
        }
    }

    async findOneBy(filter) {
        const user = await User.findOne(filter)
        return user
    }
}

const userDao = new UserDAO()
module.exports = userDao