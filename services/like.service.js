const logger = require("../helpers/logger")
const likeDao = require('../dao/like')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {LikeError} = require('../routes/like/LikeErrors')

class LikeService {
    async increase(userId, nftId) {
        logger.info('LikeService.increase')
        try {
            await likeDao.findOneAndUpdate(userId, nftId, true)
        } catch(e) {
            const errMsg = messageHelper.getMessage('like_increase_failed', userId, nftId, e)
            logger.error(errMsg)
            throw new LikeError({message: errMsg, code: 400})
        }
    }

    async decease(userId, nftId) {
        logger.info('LikeService.decease')
        try {
            await likeDao.findOneAndUpdate(userId, nftId, true)
        } catch(e) {
            const errMsg = messageHelper.getMessage('like_decease_failed', userId, nftId, e)
            logger.error(errMsg)
            throw new LikeError({message: errMsg, code: 400})
        }
    }

    async isLike(userId, nftId) {
        logger.info('LikeService.isLike')
        try {
            const like = await likeDao.findOne({userId: userId, nftId: nftId})
            const isLike = like ? !!like.count : false
            return isLike
        } catch (e) {
            const errMsg = messageHelper.getMessage('like_check_isLike_failed', userId, nftId, e) 
            logger.error(errMsg)
            throw new LikeError({message: errMsg, code: 400})
        }
    }

    async countLike(nftId) {
        logger.info('LikeService.countLike')
        try {
            const like = await likeDao.countLike({nftId: nftId, count: 1})
        } catch (e) {
            const errMsg = messageHelper.getMessage('like_check_countLike_failed', userId, nftId, e) 
            logger.error(errMsg)
            throw new LikeError({message: errMsg, code: 400})
        }
    }
}

const likeService = new LikeService()
module.exports = likeService