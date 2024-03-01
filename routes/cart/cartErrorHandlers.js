const logger = require("../../helpers/logger");
const {sendError} = require("../../helpers/reponseHandler");
const { CartError } = require("./CartErrors")

module.exports = (router) => {
    function handleCartError() {
        return (error, req, res, next) => {
            if (error instanceof CartError) {
                logger.debug('error handing CartError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleCartError ')
                next(error)
            }
        }
    }

    router.use(handleCartError())
}