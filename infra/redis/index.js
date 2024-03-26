const { createClient } = require('redis')
const config = require('../../config/configuration')
const logger = require('../../helpers/logger')

function connect_redis() {
    const url = `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}`

    const client = createClient({url: url})

    client.on('connect', () => { 
        logger.info('Redis server is connected!');
    });
    client.on('error', (err) => {
        logger.info('Redis Client Error', err)
        process.exit()
    });
    
    client.connect();
    return client
}

const redisClient = connect_redis()
module.exports = redisClient