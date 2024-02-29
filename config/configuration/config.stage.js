const config = require('./config.global')
config.env = 'testnet'
config.database = {
    ...config.database,
    dataBaseName: config.env
}

module.exports = config