const {TodoError} = require("./TodoErrors");
const logger = require("../../helpers/logger");
const {sendError} = require("../../helpers/reponseHandler");

module.exports = (router) => {
    function handleTodoError() {
        return (error, req, res, next) => {
            if (error instanceof TodoError) {
                logger.debug('error handing TodoError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleTodoError ')
                next(error)
            }
        }
    }

    router.use(handleTodoError())
}