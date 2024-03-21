const logger = require("../../helpers/logger");
const {sendError} = require("../reponseHandler");
const { OrderError, OrderViewError } = require("./OrderErrors")

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

    function handleOrderViewError() {
        return (error, req, res, next) => {
            if (error instanceof OrderViewError) {
                logger.debug('error handing OrderViewError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleOrderViewError ')
                next(error)
            }
        }
    }

    router.use(handleOrderError())
    router.use(handleOrderViewError())
}