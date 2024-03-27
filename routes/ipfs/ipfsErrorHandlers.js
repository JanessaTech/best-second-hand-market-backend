const logger = require("../../helpers/logger");
const {sendError} = require("../reponseHandler");
const { IPFSError } = require("./IPFSErrors")

module.exports = (router) => {
    function handleIPFSError() {
        return (error, req, res, next) => {
            if (error instanceof IPFSError) {
                logger.debug('error handing IPFSError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleIPFSError ')
                next(error)
            }
        }
    }

    router.use(handleIPFSError())
}