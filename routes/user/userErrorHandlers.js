const {UserError} = require("./UserErrors");
const logger = require("../../helpers/logger");
const {sendError} = require("../../helpers/reponseHandler");

module.exports = (router) => {
    function handleUserError() {
        return (error, req, res, next) => {
            if (error instanceof UserError) {
                logger.debug('error handing UserError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleUserError ')
                next(error)
            }
        }
    }

    router.use(handleUserError())
}