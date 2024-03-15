const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const {Comment} = require('../models')
const {CommentError} = require('../routes/comment/CommentErrors')

class CommentDAO {
    async create(comment) {
        try {
            const commentDao = new Comment({
                nftId: comment?.nftId,
                parentId : comment?.parentId,
                user : comment.user,
                content : comment.content
            })
            let savedComment = await commentDao.save().then((saved) => saved.populate('user'))
            logger.debug('CommentDAO.create. a new comment is created successfully.', savedComment)
            return savedComment
        } catch (err) {
            logger.error('Failed to create a new comment due to ', err)
            throw new CommentError({key: 'comment_create_validiation_failed', params:[comment?.nftId, comment?.parentId, comment.user,  err], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async delete(id) {
        try {
            await Comment.findByIdAndDelete({_id: id})
        } catch (e) {
            const errMsg = messageHelper.getMessage('comment_delete_failed', id, e)
            logger.error(errMsg)
            throw new CommentError({message: errMsg, code: 400})
        }
    }

    async queryByPagination(filter, options) {
        options.populate = 'user:id name profile,replies:id user content createdAt updatedAt:user|id name profile'
        const comments = await Comment.paginate(filter, options)
        return comments
    }
}

const commentDao = new CommentDAO()
module.exports = commentDao