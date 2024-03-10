const bcrypt = require('bcrypt')
const logger = require('../helpers/logger')
const {AccountError} = require("../routes/account/AccountErrors");
class AccountService {
    accountMap = new Map()
    cnt = 0
    async login(acc) {
        logger.info('AccountService.login...')
        let users = this.findAccount(acc.name)
        if (users.length !== 0) {
            if (bcrypt.compareSync(acc.password,users[0].password)) {
                return users[0]
            } else {
                throw new AccountError({key: 'account_login_wrong_password'})

            }
        } else {
            throw new AccountError({key: 'account_not_found', params:[acc.name], code:404})
        }
    }

    findAccount(name) {
        return Array.from(this.accountMap.values()).filter(value => value.name === name)
    }
    async register(acc) {
        logger.info('AccountService.register...')
        acc.id = this.cnt.toString()
        this.accountMap.set(this.cnt.toString(), acc)
        this.cnt++
        return acc
    }

    async getAllAccounts() {
        return Object.fromEntries(this.accountMap)
    }

    async getAccountById(id) {
        if (this.accountMap.has(id)) {
            return this.accountMap.get(id)
        } else {
            throw new AccountError({key: 'account_not_found', params:[id], code:404})
        }
    }

    getUserByIdInSyn(id) {
        if (this.accountMap.has(id)) {
            return this.accountMap.get(id)
        } else {
            throw new AccountError({key: 'account_not_found', params:[id], code:404})
        }
    }
    async updateAccount(acc) {
        if (this.accountMap.has(acc.id)) {
            this.accountMap.set(acc.id, acc)
            return acc
        } else {
            throw new AccountError({key: 'account_not_found', params:[acc.name], code:404})
        }
    }

    async deleteAccountById(id) {
        if (this.accountMap.has(id)) {
            this.accountMap.delete(id)
        } else {
            throw new AccountError({key: 'account_not_found', params:[id], code:404})
        }
    }
}

const accountService = new AccountService()
module.exports = accountService