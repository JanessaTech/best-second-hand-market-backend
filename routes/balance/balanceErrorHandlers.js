const logger = require("../../helpers/logger");
const {sendError} = require("../reponseHandler");
const { BalanceError } = require("./BalanceErrors")

module.exports = (router) => {
    function handleBalanceError() {
        return (error, req, res, next) => {
            if (error instanceof BalanceError) {
                logger.debug('error handing BalanceError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleBalanceError ')
                next(error)
            }
        }
    }

    router.use(handleBalanceError())
}