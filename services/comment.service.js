const logger = require("../helpers/logger")
const comentDao = require('../db')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {CommentError} = require('../routes/comment/CommentErrors')
const {commentDao} = require("../db")

class CommentService {
    async create(nftId, parentId, user, content) {
        logger.info('CommentService.create')
        const comment = {nftId: nftId, parentId: parentId, user: user, content: content}
        try {
            const savedComment = await comentDao.create(comment)
            return savedComment
        } catch (e) {
            logger.error('Failed to create a new comment ', comment)
            throw new CommentError({key: 'comment_create_failed', params: [nftId, parentId, user, e]})
        } 
    }

    async delete(id) {
        logger.info('CommentService.delete. id=', id)
        try {
            await commentDao.delete(id)
        } catch (e) {
            throw e
        }
    }

    async queryCommentsByNftId(nftId, page, limit, sortBy) {
        logger.info('CommentService.queryCommentsByNftId. nftId =', nftId)
        try {
            const filter = {nftId: nftId}
            const options = {page: page, limit: limit, sortBy: sortBy}
            const resultByFilter = await comentDao.queryByPagination(filter, options)
            return {comments: resultByFilter.results, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
        } catch (e) {
            const errMsg = messageHelper.getMessage('comment_query_by_nftId_failed', nftId, e)
            throw new CommentError({message: errMsg})
        }
    }
}

const commentService = new CommentService()
module.exports = commentService