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
     * @param {
     *          params:{
     *              address - The wallet address used to get user
     *          } 
     *        } req    : The request sent by frontend
     * @param {*} res  : The response sent back to frontend. The format is the same as register
     * @param {*} next : The object used by routes to control the workflow of req&res&exception handling
     */
    async findUserByAddress(req, res, next) {
        logger.info('UserController.findUserByAddress. address = ', req.params?.address)
        try {
            const address = req.params.address
            const payload = await userService.findUserByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_find_by_address', address), {user: payload})
        } catch(e) {
            next(e)
        }
    }

    /**
     * Login by wallet address, returns the user info
     * @param {
     *          body: {
     *              address - The wallet address used to login. If the user associated with the address doesn't exist, 404 is returned
     *          }
     *        } req    : The request sent by frontend
     * @param {*} res  : The response sent back to frontend. The format is the same as register
     * @param {*} next : The object used by routes to control the workflow of req&res&exception handling
     */
    async loginByAddress(req, res, next) {
        logger.info('UserController.login. address=', req.body.address)
        try {
            const address = req.body.address
            const payload = await userService.loginByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_login_success', address), {user: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Logout for an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async logoutByAddress(req, res, next) {
        logger.info('UserController.logout address=', req.body.address)
        try {
            const address = req.body.address
            const payload = await userService.logoutByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_logout_success', address), {user: payload})
        } catch (e) {
            next(e)
        }
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