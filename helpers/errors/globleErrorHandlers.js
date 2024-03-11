const globalErrors = require('./globalErrors')
const {sendError} = require('../reponseHandler')
const ValidationError = require('yup').ValidationError
const {JsonWebTokenError,TokenExpiredError} = require("jsonwebtoken")
const {MulterError} = require("multer")

module.exports = (app) => {
    function handleValidationError() {
        return (error, req, res, next) => {
            if (error instanceof ValidationError) {
                error.code = 400
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleJsonWebTokenError() {
        return (error, req, res, next) => {
            if (error instanceof JsonWebTokenError) {
                error.code = 400
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleTokenExpiredError() {
        return (error, req, res, next) => {
            if (error instanceof TokenExpiredError) {
                error.code = 400
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }
    function handleUnSupportedAuth() {
        return (error, req, res, next) => {
            if (error instanceof globalErrors.UnSupportedAuthError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleUnauthorizedError() {
        return (error, req, res, next) => {
            if (error instanceof globalErrors.UnauthorizedError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleUnmatchedTokenError() {
        return (error, req, res, next) => {
            if (error instanceof globalErrors.UnmatchedTokenError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleMuterError() {
        return (error, req, res, next) => {
            if (error instanceof MulterError) {
                error.code = 400
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    /**
     * This is an example how to handle GlobalDemoError
     * @returns
     */
    function handleGlobalDemoError() {
        return (error, req, res, next) => {
            if (error instanceof globalErrors.GlobalDemoError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleDefaultError() {
        return (error, req, res, next) => {
            error.key = 'Error'
            error.code = 500
            sendError(res, error)
        }
    }

    app.use(handleValidationError())
    app.use(handleJsonWebTokenError())
    app.use(handleTokenExpiredError())
    app.use(handleUnSupportedAuth())
    app.use(handleUnauthorizedError())
    app.use(handleUnmatchedTokenError())
    app.use(handleMuterError())
    //app.use(handleGlobalDemoError())
    app.use(handleDefaultError())
}