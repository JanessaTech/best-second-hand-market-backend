const redisClient = require('../redis')
const logger = require('../../helpers/logger')
const {RedisError} = require('./RedisError')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')

const hSet = async (key, field, value) => {
    try {
        await redisClient.hSet(key, field, value)
    } catch (err) {
        const errMsg = messageHelper.getMessage('redis_addOrUpdate_failed', key, field, value, err)
        logger.error(errMsg)
        throw new RedisError({message: errMsg, code:400})
    }
}

const hDel = async (key, field) => {
    try {
        await redisClient.hDel(key, field)
    } catch (err) {
        const errMsg = messageHelper.getMessage('redis_delete_failed', key, field, err)
        logger.error(errMsg)
        throw new RedisError({message: errMsg, code:400})
    }
}

const hGet = async (key, field) => {
    try {
        const res = await redisClient.hGet(key, field)
        return res
    } catch (err) {
        const errMsg = messageHelper.getMessage('redis_get_failed', key, field, err)
        logger.error(errMsg)
        throw new RedisError({message: errMsg, code:400})
    }
}

module.exports = {
    hSet,
    hDel,
    hGet
} 