const logger = require("../helpers/logger");
const bcrypt = require("bcrypt");
const {UserError} = require("../routes/user/UserErrors");

class UserService {
    userMap = new Map()
    cnt = 0

    async register(user) {
        logger.info('UserService.register...')
        let users = this.findUser(user.name)
        if (users.length !== 0) {
            throw new UserError({key: 'user_register_duplicated_name', params:[user.name]})
        }
        user.id = this.cnt
        this.userMap.set(this.cnt, user)
        this.cnt++
        return user
    }

    async login(user) {
        logger.info('UserService.login...')
        let users = this.findUser(user.name)
        if (users.length !== 0) {
            if (bcrypt.compareSync(user.password,users[0].password)) {
                return users[0]
            } else {
                throw new UserError({key: 'user_login_wrong_password', params:[user.name]})
            }
        } else {
            throw new UserError({key: 'user_not_found', params:[user.name]})
        }
    }

    findUser(name) {
        return Array.from(this.userMap.values()).filter(value => value.name === name)
    }

    async getUserById(id) {
        if (this.userMap.has(id)) {
            return this.userMap.get(id)
        } else {
            throw new UserError({key: 'user_not_found', params:[id]})
        }
    }

    getUserByIdInSyn(id) {
        if (this.userMap.has(id)) {
            return this.userMap.get(id)
        } else {
            throw new UserError({key: 'user_not_found', params:[id]})
        }
    }

    async updateUser(user) {
        if (this.userMap.has(user.id)) {
            let u = this.userMap.get(user.id)
            //u.name = user.name
            //u.password = user.password
            u.age = user.age || u.age
            u.email = user.email || u.email
            return u
        } else {
            throw new UserError({key: 'user_not_found', params:[user.name]})
        }
    }
}

const userService = new UserService()
module.exports = userService