const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const config = require('../config/configuration')

mongoose.connect(`mongodb://${config.database.host}:27017/${config.database.dataBaseName}`)
let conn = mongoose.connection
conn.once('open', () => {
    logger.info(`mongodb connection url: mongodb://${config.database.host}:27017/${config.database.dataBaseName}`)
    logger.info('Connected to the database.')
});
conn.on('error', (err) => {
    logger.debug(`mongodb connection url: mongodb://${config.database.host}:27017/${config.database.dataBaseName}`)
    logger.error(`Database error: ${err}`)
    process.exit()
});

module.exports = {
    cartDao: require('./dao/cart'),
    commentDao: require('./dao/comment'),
    likeDao: require('./dao/like'),
    nftDao: require('./dao/nft'),
    nftViewDao: require('./dao/nftView'),
    orderDao: require('./dao/order'),
    orderViewDao: require('./dao/orderView'),
    userDao: require('./dao/user'),
    ipfsDao: require('./dao/ipfs'),
    balanceDao: require('./dao/balance')
}