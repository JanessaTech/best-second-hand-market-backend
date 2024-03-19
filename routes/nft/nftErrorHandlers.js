const logger = require("../../helpers/logger");
const {sendError} = require("../reponseHandler");
const { NftError } = require("./NftErrors")

module.exports = (router) => {
    function handleNftError() {
        return (error, req, res, next) => {
            if (error instanceof NftError) {
                logger.debug('error handing NftError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleNftError ')
                next(error)
            }
        }
    }

    router.use(handleNftError())
}