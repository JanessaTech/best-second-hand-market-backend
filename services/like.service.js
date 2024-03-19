const logger = require("../helpers/logger")
const {likeDao} = require('../db')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {LikeError} = require('../routes/like/LikeErrors')

class LikeService {
    async increase(userId, nftId) {
        logger.info('LikeService.increase')
        try {
            await likeDao.findOneAndUpdate(userId, nftId)
        } catch(e) {
            throw e
        }
    }

    async decease(userId, nftId) {
        logger.info('LikeService.decease')
        try {
            await likeDao.delete(userId, nftId)
        } catch(e) {
            throw e
        }
    }

    async isLike(userId, nftId) {
        logger.info('LikeService.isLike')
        try {
            const like = await likeDao.findOneByFilter({userId: userId, nftId: nftId})
            const isLike = like ? true : false
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
            const count = await likeDao.countLike({nftId: nftId})
            return count
        } catch (e) {
            const errMsg = messageHelper.getMessage('like_check_countLike_failed', userId, nftId, e) 
            logger.error(errMsg)
            throw new LikeError({message: errMsg, code: 400})
        }
    }
}

const likeService = new LikeService()
module.exports = likeService