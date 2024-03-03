const express = require('express')
const router = express.Router()
const controller = require('../../controllers/like.controller')
const initLikeErrorHandlers = require('./likeErrorHandlers')
const {validate} = require('../../middlewares')
const {likeSchema} = require('../schemas')

router.post('/', validate(likeSchema.like), controller.like)
router.post('/unlike', validate(likeSchema.unlike), controller.unlike)
router.get('/isLike', validate(likeSchema.isLike), controller.isLike)
router.get('/countLike/:nftId', validate(likeSchema.countLike), controller.countLike)

initLikeErrorHandlers(router)
module.exports = router