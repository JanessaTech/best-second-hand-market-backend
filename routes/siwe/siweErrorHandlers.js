const {SiweError} = require("./SiweError")
const logger = require("../../helpers/logger")
const {sendError} = require("../reponseHandler")

module.exports = (router) => {
    function handleSiweError() {
        return (error, req, res, next) => {
            if (error instanceof SiweError) {
                logger.debug('error handing SiweError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleSiweError ')
                next(error)
            }
        }
    }
    router.use(handleSiweError())
}