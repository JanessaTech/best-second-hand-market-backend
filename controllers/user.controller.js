const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const userService = require('../services/user.service')
const messageHelper = require('../helpers/internationaliztion/messageHelper')

class UserController {

    /**
     * Register a user which is associated with a wallet address
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async register(req, res, next) {
        logger.info('UserController.register')
        try {
            const user = {
                name: req.body.name,
                address: req.body.address,
                intro: req.body.intro,
                gateway: req.body.gateway
            }
            const payload = await userService.register(user)
            sendSuccess(res, messageHelper.getMessage('user_register', payload.name))
        } catch (e) {
            next(e)
        }
    }

    /**
     * Get the user which is associated with a wallet address
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getUserByWalletAddress(req, res, next) {

    }

    /**
     * Login by wallet address, return the user info
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async login(req, res, next) {

    }

    /**
     * Logout for an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async logout(req, res, next) {

    }

    /**
     * Get an overview of a user by id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getOverViewById(req, res, next) {

    }

    /**
     * Update user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {

    }
}

const controller = new UserController()
module.exports = controller