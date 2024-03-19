const logger = require('../../helpers/logger')
const {Like} = require('../models')
const {LikeError} = require('../../routes/like/LikeErrors')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')

class LikeDAO {
    async findOneAndUpdate(userId, nftId) {
        try {
            await Like.findOneAndUpdate({userId: userId, nftId: nftId}, {userId: userId, nftId: nftId}, {upsert: true })
            logger.debug('LikeDAO.findOneAndUpdate. a like item is findOneAndUpdated successfully. userId =', userId, ' nftId =', nftId)
        } catch (err) {
            logger.error('Failed to findOneAndUpdate a new like item due to ', err)
            throw new LikeError({key: 'like_findOneAndUpdate_validiation_failed', params:[userId, nftId, err], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }

    async delete(userId, nftId) {
        try {
            await Like.findOneAndDelete({userId: userId, nftId: nftId})
        }catch(err) {
            const errMsg = messageHelper.getMessage('like_delete_failed', userId, nftId, err)
            logger.error(errMsg)
            throw new LikeError({message: errMsg, code: 400})
        }
    }

    async findOneByFilter(filter) {
        const like = await Like.findOne(filter)
        return like
    }

    async queryAllByFilter(filter) {
        const likes = await Like.find(filter)
        return likes
    }

    async countLike(filter) {
        const count = await Like.countDocuments(filter)
        return count
    }
}

const likeDao = new LikeDAO()
module.exports = likeDao