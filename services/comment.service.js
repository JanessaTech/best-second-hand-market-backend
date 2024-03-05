const logger = require("../helpers/logger")
const comentDao = require('../dao/comment')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {CommentError} = require('../routes/comment/CommentErrors')

class CommentService {
    async addComment(nftId, parentId, userId, content) {
        logger.info('CommentService.addComment')
        const comment = {nftId: nftId, parentId: parentId, userId: userId, content: content}
        try {
            const savedComment = await comentDao.add(comment)
            return savedComment
        } catch (e) {
            logger.error('Failed to add a new comment ', comment)
            throw new CommentError({key: 'comment_add_comment_failed', params: [nftId, parentId, userId, e]})
        } 
    }

    async deleteComment(id) {

    }

    async queryCommentsByNftId(nftId, page, limit, sortBy) {
        logger.info('CommentService.queryCommentsByNftId. nftId =', nftId)
        try {
            const filter = {nftId: nftId}
            const options = {page: page, limit: limit, sortBy: sortBy}
            const comments = []
            const resultByFilter = await comentDao.queryByPagination(filter, options)
            return {comments: resultByFilter.results, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
        } catch (e) {
            const errMsg = messageHelper.getMessage('comment_query_comments_failed', nftId)
            throw new CommentError({message: errMsg})
        }
    }
}

const commentService = new CommentService()
module.exports = commentService