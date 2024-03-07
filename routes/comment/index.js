const express = require('express')
const router = express.Router()
const controller = require('../../controllers/comment.controller')
const initCommentErrorHandlers = require('./commentErrorHandlers')
const {validate} = require('../../middlewares')
const {commentSchema} = require('../schemas')

router.post('/', validate(commentSchema.create), controller.create)
router.delete('/:id', validate(commentSchema.delete), controller.delete)
router.get('/:nftId', validate(commentSchema.queryCommentsByNftId), controller.queryCommentsByNftId)

initCommentErrorHandlers(router)
module.exports = router