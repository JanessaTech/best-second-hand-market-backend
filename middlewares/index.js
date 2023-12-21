const logger = require('../helpers/logger')
const jwt = require("jsonwebtoken")
const globalErrors = require('../helpers/errors/globalErrors')
const urlHelper = require('../helpers/urlHelper')
const accountService = require('../services/account.service')

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
                                const error = new globalErrors.UnmatchedTokenError({params: [user.name]})
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
                const error = new globalErrors.UnSupportedAuthError()
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
            let allowedPermissions = urlHelper.getRoles(req.originalUrl)
            let isAllowed = user.roles.some(r => allowedPermissions.includes(r))
            if (authenticated && isAllowed) {
                next()
            } else {
                let error = new globalErrors.UnauthorizedError({params: [req.originalUrl]})
                next(error)
            }
        }
    }
}

module.exports = middlewares