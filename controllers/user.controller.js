const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const userService = require('../services/user.service')
const nftService = require('../services/nft.service')
const orderService = require('../services/order.service')
const {UserError} = require('../routes/user/UserErrors')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const path  = require("path")
const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0]
        cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`)
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 1048576}, // less than 1M
    fileFilter: (req, file, cb) => {
        checkFileType(req, file, cb);
    },
}).single('profile');

function checkFileType(req, file, cb) {
    // Allowed extensions
    var fileTypes = /jpeg|jpg|png|gif/;
    // Check extention
    var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    var mimeType = fileTypes.test(file.mimetype);
  
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(null, false);
  }


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
     * Update user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {
        logger.info('UserController.update. id =',req.body.id, 'name = ', req.body.name, ' intro =', req.body.intro)
        const id = req.body.id
        const name = req.body.name
        const intro = req.body.intro
        try {
            const payload = await userService.update(id, name, intro)
            sendSuccess(res, messageHelper.getMessage('user_update_success', id, name, intro), {user: payload})
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
        logger.info('UserController.getOverViewById. id =', req.params.id)
        const id = req.params.id
        try {
            const user = await userService.findUserById(id)
            const countNft = await nftService.countNFTsByAddress(user.address)
            const countOrder = await orderService.countForUser(id)
            const payload = {
                id: user._id, 
                name: user.name,
                intro: user.intro,
                loginTime: user.loginTime,
                countNft: countNft,
                countOrder: countOrder
            }
            sendSuccess(res, messageHelper.getMessage('user_overview_success', id), {overview: payload})
        } catch (e) {
            if (!(e instanceof UserError)) {
                throw new UserError({key: 'user_overview_failed', params: [id, e]})
            } else {
                next(e)
            }
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

    async uploadFile(req, res, next) {
        logger.info('UserController.upload_file')
        logger.debug('req.body.name:', req.body.name)
        logger.debug(req.file.filename)
        sendSuccess(res, 'file is uploaded successfully')
    }
}

const controller = new UserController()
module.exports = controller