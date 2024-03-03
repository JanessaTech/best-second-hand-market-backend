const logger = require('../helpers/logger')
const {Like} = require('../models')

class LikeDAO {
    async findOneAndUpdate(userId, nftId, isInc ) {
        try {
            await Like.findOneAndUpdate({userId: userId, nftId: nftId}, {$inc : {'count' : isInc ? 1 : -1}},{ new: true, upsert: true })
            logger.debug('LikeDAO. findOneAndUpdate successfully. userId=', userId, 'nftId=', nftId, 'isInc=', isInc)
        } catch (e) {
            throw e
        } 
    }

    async findOne(filter) {
        const like = await Like.findOne(filter)
        return like
    }

    async countLike(filter) {
        const count = await Like.countDocuments(filter)
        return count
    }
}

const likeDao = new LikeDAO()
module.exports = likeDao