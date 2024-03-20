const logger = require("../../helpers/logger");
const {sendError} = require("../reponseHandler");
const { OrderError, FullOrderViewError } = require("./OrderErrors")

module.exports = (router) => {
    function handleOrderError() {
        return (error, req, res, next) => {
            if (error instanceof OrderError) {
                logger.debug('error handing OrderError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleOrderError ')
                next(error)
            }
        }
    }

    function handleFullOrderViewError() {
        return (error, req, res, next) => {
            if (error instanceof FullOrderViewError) {
                logger.debug('error handing FullOrderViewError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleFullOrderViewError ')
                next(error)
            }
        }
    }

    router.use(handleOrderError())
    router.use(handleFullOrderViewError())
}