const AccountErrors = require("./AccountErrors")
const logger = require("../../helpers/logger")
const {sendError} = require("../../helpers/reponseHandler")

module.exports = (router) => {
    function handleAccountError() {
        return (error, req, res, next) => {
            if (error instanceof AccountErrors.AccountError) {
                logger.debug('error handing AccountError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleAccountError ')
                next(error)
            }
        }
    }

    /**
     * Here is an example of how to deal with AccountDemoError locally
     * @returns {(function(*, *, *, *): void)|*}
     */
    /*function handleAccountDemoError() {
        return (error, req, res, next) => {
            if (error instanceof AccountErrors.AccountDemoError) {
                logger.debug('error handing AccountDemoError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleAccountDemoError ')
                next(error)
            }
        }
    }*/

    router.use(handleAccountError())
   // router.use(handleAccountDemoError())
}