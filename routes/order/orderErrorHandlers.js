const logger = require("../../helpers/logger");
const {sendError} = require("../reponseHandler");
const { OrderError } = require("./OrderErrors")

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

    router.use(handleOrderError())
}