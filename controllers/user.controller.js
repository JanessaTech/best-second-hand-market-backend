const userService = require('../services/user.service')
const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const bcrypt = require("bcrypt");
const tokenHelper = require("../helpers/jwt/token")
class UserController {
    async register(req, res, next) {
        logger.info('UserController.register')
        try {
            const user = {
                name: req.body.name,
                password : bcrypt.hashSync(req.body.password,8),
                age: req.body.age,
                roles: req.body.roles,
                email: req.body.email
            }
            logger.info(user)
            let payload = await userService.register(user)
            sendSuccess(res, messageHelper.getMessage('user_register', payload.name))
        } catch(e) {
            next(e)
        }
    }
    async login(req, res, next) {
        logger.info('UserController.login: ', req.body.name)
        try {
            const user = {
                name : req.body.name,
                password: req.body.password
            }
            let re = await userService.login(user)
            re.token = tokenHelper.generateToken(re)
            let payload = {id: re.id, name: re.name, token: re.token}
            let message = messageHelper.getMessage('user_login', payload.name)
            sendSuccess(res, message, payload)
        } catch (e){
            next(e)
        }
    }

    async getUserById(req, res, next) {
        logger.info('UserController.getUserById')
        try {
            let payload = await userService.getUserById(parseInt(req.params.id))
            sendSuccess(res, messageHelper.getMessage('user_getById', req.params.id), payload)
        }catch (e) {
            next(e)
        }

    }
    async updateUser(req, res, next) {
        logger.info('UserController.updateUser')
        try {
            let payload = await userService.updateUser(req.body)
            sendSuccess(res, messageHelper.getMessage('user_update', payload.name), payload)
        } catch (e) {
            next(e)
        }
    }
}

const controller = new UserController()
module.exports = controller