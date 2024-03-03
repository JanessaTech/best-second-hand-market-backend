const logger = require("../../helpers/logger");
const {sendError} = require("../../helpers/reponseHandler");
const { LikeError } = require("./LikeErrors")

module.exports = (router) => {
    function handleLikeError() {
        return (error, req, res, next) => {
            if (error instanceof LikeError) {
                logger.debug('error handing LikeError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleLikeError ')
                next(error)
            }
        }
    }

    router.use(handleLikeError())
}