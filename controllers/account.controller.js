const accountService = require('../services/account.service')
const {sendSuccess} = require('../helpers/reponseHandler')
const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const bcrypt = require('bcrypt')
const tokenHelper = require('../helpers/jwt/token')

class AccountController {
    async login(req, res, next) {
        logger.info('AccountController.login')
        try {
            const acc = {
                name : req.body.name,
                password: req.body.password
            }
            let payload = await accountService.login(acc)
            payload.token = tokenHelper.generateToken(payload)
            let message = messageHelper.getMessage('account_login', payload.name)
            sendSuccess(res, message, payload)
        } catch (e){
            next(e)
        }
    }
    async register(req, res, next){
        logger.info('AccountController.register')
        try {
            const acc = {
                name: req.body.name,
                password : bcrypt.hashSync(req.body.password,8),
                roles: req.body.roles,
                email: req.body.email
            }
            let payload = await accountService.register(acc)
            sendSuccess(res, messageHelper.getMessage('account_register', payload.name))
        } catch (e) {
            next(e)
        }
    }
    async getAllAccounts(req, res, next) {
        logger.info('AccountController.getAllUsers')
        try {
            let payload = await accountService.getAllAccounts()
            sendSuccess(res, messageHelper.getMessage('account_getAll'), payload)
        } catch (e) {
            next(e)
        }
    }

    async getAccountById(req, res, next) {
        logger.info('AccountController.getUserById')
        try {
            let payload = await accountService.getAccountById(req.params.id)
            sendSuccess(res, messageHelper.getMessage('account_getById', req.params.id), payload)
        }catch (e) {
            next(e)
        }
    }

    async updateAccount(req, res, next){
        logger.info('AccountController.updateUser')
        try {
            let payload = await accountService.updateAccount(req.body)
            sendSuccess(res, messageHelper.getMessage('account_update', payload.name), payload)
        } catch (e) {
            next(e)
        }
    }

    async deleteAccountById(req, res, next){
        logger.info('AccountController.deleteUserById')
        try{
            await accountService.deleteAccountById(req.params.id)
            sendSuccess(res, messageHelper.getMessage('account_deleteById', req.params.id))
        } catch (e) {
            next(e)
        }
    }
}

const controller = new AccountController()
module.exports = controller