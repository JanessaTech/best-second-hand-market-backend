const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const commentService = require('../services/comment.service')
const {CommentError} = require('../routes/comment/CommentErrors')

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
            if (nftId && parentId) throw new CommentError({key: 'comment_nftId_or_parentId'})  // to-do: validate by schema
            const payload  = await commentService.addComment(nftId, parentId, userId, content)
            sendSuccess(res, messageHelper.getMessage('comment_add_success', nftId, parentId, userId), {comment: payload})
        } catch (e) {
            next(e)
        }
    }

    async deleteComment(req, res, next) {
        logger.info('CommentController.deleteComment. id=', req.params.id)
        const id = req.params.id
        try {
            await commentService.deleteComment(id)
            sendSuccess(res, messageHelper.getMessage('comment_delete_success', id))
        } catch (e) {
            next(e)
        }
    }

    /**
     * Get the list of comments by nft id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryCommentsByNftId(req, res, next) {
        logger.info('CommentController.queryCommentsByNftId. nftId=', req.params.nftId, ' page = ', req.query.page, ' limit = ', req.query.limit, ' sortBy = ', req.query.sortBy)
        const nftId = req.params.nftId
        const page = req.query.page
        const limit = req.query.limit
        const sortBy = req.query.sortBy
        try {
            const payload = await commentService.queryCommentsByNftId(nftId, page, limit, sortBy)
            sendSuccess(res, messageHelper.getMessage('comment_query_comments_success', nftId), payload)
        } catch(e) {
            next(e)
        }

    }
}

const controller = new CommentController()
module.exports = controller