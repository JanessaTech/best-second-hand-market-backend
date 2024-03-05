const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const Comment = require('../models/comment.model')
const {CommentError} = require('../routes/comment/CommentErrors')

class CommentDAO {
    async add(comment) {
        try {
            const commentDao = new Comment({
                nftId: comment?.nftId,
                parentId : comment?.parentId,
                userId : comment.userId,
                content : comment.content
            })
            let savedComment = await commentDao.save().then((saved) => saved.populate('userId'))
            logger.debug('CommentDAO.add. a new comment is added successfully.', savedComment)
            return savedComment
        } catch (err) {
            logger.error('Failed to add a new comment due to ', err)
            throw new CommentError({key: 'comment_add_validiation_failed', params:[comment?.nftId, comment?.parentId, comment.userId,  err], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async delete(id) {
        try {
            await Comment.findByIdAndDelete({_id: id})
        } catch (e) {
            const errMsg = messageHelper.getMessage('comment_delete_failed', id, err)
            logger.error(errMsg)
            throw new CommentError({message: errMsg, code: 400})
        }
    }

    async queryByPagination(filter, options) {
        options.populate = 'userId:id name,replies:id userId:userId|id name createdAt'
        const comments = await Comment.paginate(filter, options)
        return comments
    }
}

const commentDao = new CommentDAO()
module.exports = commentDao