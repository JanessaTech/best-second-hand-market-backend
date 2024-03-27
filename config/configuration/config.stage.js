const config = require('./config.global')
config.env = 'testnet'
config.database = {
    ...config.database,
    dataBaseName: config.env
}
config.redis = {
    ...config.redis,
}
config.nft_storage = {
    ...config.nft_storage,
}

module.exports = config