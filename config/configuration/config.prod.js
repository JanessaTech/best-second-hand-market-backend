const config = require('./config.global')
config.env = 'mainnet'
config.database = {
    ...config.database,
    dataBaseName: config.env
}

module.exports = config