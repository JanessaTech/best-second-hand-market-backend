const messageHelper = require("./internationaliztion/messageHelper");

module.exports = class Response {
    static sendSuccess(res, message, data = undefined, code = 200) {
        res.status(code).json({
            success: true,
            code: code,
            message: message,
            data : data
        })
    }

    static sendError(res, error) {
        let key = error.key || error.name
        let code = error?.code ? error.code : 400
        let params = error.params || []
        let message = error.message || messageHelper.getMessage(key, ...params)
        res.status(code).json({
            success: false,
            code: code,
            message: message,
            errors: error.errors
        })
    }
}