const logger = require("../helpers/logger")
const comentDao = require('../dao/comment')
const messageHelper = require("../helpers/internationaliztion/messageHelper")

class CommentService {
    async addComment(comment) {
        
    }

    async deleteComment(id) {

    }

    async queryCommentsByNftId(nftId) {

    }
}

const commentService = new CommentService()
module.exports = commentService