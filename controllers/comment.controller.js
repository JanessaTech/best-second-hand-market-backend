const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')

class CommentController {
    /**
     * Add a new comment for a nft or reply a comment for an existing comment
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async addComment(req, res, next) {
        logger.info('CommentController.addComment. nftId =', req.body.nftId, ' parentId =', req.body.parentId, ' userId = ', req.body.userId)
        const nftId = req.body.nftId
        const parentId = req.body.parentId
        const userId = req.body.userId
        const content = req.body.content

        try {
            
        } catch (e) {
            next(e)
        }
    }

    async deleteComment(req, res, next) {

    }

    /**
     * Get the list of comments by nft id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryCommentsByNftId(req, res, next) {

    }
}

const controller = new CommentController()
module.exports = controller