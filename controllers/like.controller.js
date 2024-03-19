const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const likeService = require('../services/like.service')
const {sendSuccess} = require('../routes/reponseHandler')

class LikeController {
    /**
     * increment like by one for a nft by a user
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async like(req, res, next) {
        logger.info('LikeController.like. userId = ', req.body.userId, 'nftId =', req.body.nftId)
        const userId = req.body.userId
        const nftId = req.body.nftId
        try {
            await likeService.increase(userId, nftId)
            sendSuccess(res, messageHelper.getMessage('like_increase_success', nftId, userId))
        } catch(e) {
            next(e)
        }
    }

    /**
     * unlike a nft by an user
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async unlike(req, res, next) {
        logger.info('LikeController.unlike. userId = ', req.body.userId, 'nftId =', req.body.nftId)
        const userId = req.body.userId
        const nftId = req.body.nftId
        try {
            await likeService.decease(userId, nftId)
            sendSuccess(res, messageHelper.getMessage('like_decrease_success', nftId, userId))
        } catch(e) {
            next(e)
        }
    }

    /**
     * Check if a nft is liked by an user
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async isLike(req, res, next) {
        logger.info('LikeController.isLike. userId = ', req.body.userId, 'nftId =', req.body.nftId)
        const userId = req.body.userId
        const nftId = req.body.nftId
        try {
            const payload = await likeService.isLike(userId, nftId)
            sendSuccess(res, messageHelper.getMessage('like_check_isLike', nftId, userId), {isLike: payload})
        } catch(e) {
            next(e)
        }

    }

    /**
     * Check how many likes for a given nft
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async countLike(req, res, next) {
        logger.info('LikeController.countLike. nftId =', req.params.nftId)
        const nftId = req.params.nftId
        try {
            const count = await likeService.countLike(nftId)
            sendSuccess(res, messageHelper.getMessage('like_count_success',nftId), {nftId: count})
        } catch(e) {
            next(e)
        }
    }
}

const controller = new LikeController()
module.exports = controller