const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const userService = require('../services/user.service')
const messageHelper = require('../helpers/internationaliztion/messageHelper')

class UserController {

    /**
     * Register an user which is associated with a wallet address
     * @param {
     *      body: {
     *           name    - The name for the new user registered
     *           address - The wallet address to associate with the new user.
     *           intro   - The introduction the user describes themselves
     *         }
     *        } req : The request sent by frontend
     * @param {
     *          success  - The flag to indicate whether the request is successful
     *          code     - Response code
     *          message  - The response message
     *          data     - The data frontend sent back to frontend if it is necessary(optional)
     *          errors   - The the detailed reason why the request is failed(optional)
     *        } res : The response sent back to frontend
     * @param {*} next : The object used by routes to control the workflow of req&res&exception handling
     */
    async register(req, res, next) {
        logger.info('UserController.register')
        try {
            const user = {
                name: req.body.name,
                address: req.body.address,
                intro: req.body.intro
            }
            const payload = await userService.register(user)
            sendSuccess(res, messageHelper.getMessage('user_register', payload.name), {user: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Get the user which is associated with a wallet address
     * @param {params:{address}} req 
     * @param {*} res  : The response sent back to frontend. The format is the same as register
     * @param {*} next : The object used by routes to control the workflow of req&res&exception handling
     */
    async getUserByWalletAddress(req, res, next) {
        logger.info('UserController.getUserByWalletAddress. address = ', req.params.address)
        try {
            const address = req.params.address
            const payload = await userService.getUserByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_getByAddress', address), {user: payload})
        } catch(e) {
            next(e)
        }
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