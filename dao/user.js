
const {User} = require('../db')
const logger = require('../helpers/logger')
const {UserError} = require('../routes/user/UserErrors')

class UserDAO {
    async create(user) {
        try {
            const userDao = new User({
                name: user.name,
                address: user.address,
                intro: user.intro,
                gateway: user.gateway
            })
            const savedUser = await userDao.save()
            logger.debug('UserDAO.create. %O is saved successfully', savedUser)
            return savedUser
        } catch (err) {
            logger.debug('Failed to save user due to ', err)
            throw new UserError({key: 'user_register_validiation_failed', params:[user.name], errors: err.errors ? err.errors : err.message, code: 400})
        } 
    }
}

const userDAO = new UserDAO()
module.exports = userDAO