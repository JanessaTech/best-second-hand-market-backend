const logger = require("../../helpers/logger");
const {sendError} = require("../../helpers/reponseHandler");
const { CommentError } = require("./CommentErrors")

module.exports = (router) => {
    function handleCommentError() {
        return (error, req, res, next) => {
            if (error instanceof CommentError) {
                logger.debug('error handing CommentError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleCommentError ')
                next(error)
            }
        }
    }

    router.use(handleCommentError())
}