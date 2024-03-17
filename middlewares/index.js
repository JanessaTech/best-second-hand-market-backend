const logger = require('../helpers/logger')
const jwt = require("jsonwebtoken")
const globalErrors = require('../helpers/errors/globalErrors')
const httpHelper = require('../helpers/httpHelper')
const accountService = require('../services/account.service')
const config = require('../config/configuration')
const path  = require("path")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${config.staticDirs.profiles}/${config.env}`)
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0]
        cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`)
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: config.multer.fileSize}, // less than 1M
    fileFilter: (req, file, cb) => {
        checkFileType(req, file, cb);
    },
});

function checkFileType(req, file, cb) {
    // Allowed extensions
    var fileTypes = config.multer.fileTypes
    var acceptedImageTypes = config.multer.acceptedImageTypes
    // Check extention
    var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    var accepted = acceptedImageTypes.includes(file.mimetype);
    if (accepted && extname) {
        return cb(null, true);
    }
    cb(null, false);
  }


const middlewares = {
    validate : (schema) => {
        return (req, res, next) => {
            try {
                schema.validateSync({body: req.body, params: req.params, query: req.query}, {abortEarly:false, stripUnknown:true})
                next()
            } catch (e){
                next(e)
            }
        }
    },
    authenticate :(userService) => {
        return (req, res, next) => {
            logger.debug('authentication...')
            if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {// Bearer
                let token = req.headers.authorization.split(' ')[1]
                jwt.verify(token, process.env.API_SECRET, function (err, decode) {
                    if (err) {
                        next(err)
                    } else {
                        let user = {
                            id : decode.id,
                            name : decode.name,
                            roles : decode.roles,
                            email: decode.email
                        }
                        res.locals.user = user
                        try {
                            let u = userService.getUserByIdInSyn(user.id)
                            if (u.token !== token) {
                                const error = new globalErrors.UnmatchedTokenError({params: [user.name], code:400})
                                next(error)
                            } else {
                                res.locals.authenticated = true
                                next()
                            }
                        } catch (error) {
                            next(error)
                        }
                    }
                })
            } else {
                const error = new globalErrors.UnSupportedAuthError({code:401})
                next(error)
            }
        }
    },
    authorize : () => {
        return (req, res, next) => {
            logger.debug('authorization...')
            logger.debug('res.locals.authenticated : ' + res.locals.authenticated)
            logger.debug('req.originalUrl:' + req.originalUrl)
            logger.debug('res.locals.user:' + res.locals.user)
            let user = res.locals.user
            let authenticated = res.locals.authenticated
            let allowedPermissions = httpHelper.getRoles(req.originalUrl)
            let isAllowed = user.roles.some(r => allowedPermissions.includes(r))
            if (authenticated && isAllowed) {
                next()
            } else {
                let error = new globalErrors.UnauthorizedError({params: [req.originalUrl], code:401})
                next(error)
            }
        }
    },
    upload: (fieldName) => {
        return (req, res, next) => {
            logger.debug('start to upload file for fieldName = ', fieldName)
            upload.single(fieldName)(req, res, function(err) {
                if (err) {
                    logger.debug('err:', err)
                    next(err)
                } else{
                    next()
                }
            })
        }
    }
}

module.exports = middlewares