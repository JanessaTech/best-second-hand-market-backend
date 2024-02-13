const config = require('./config.global')
config.env = 'prod'
config.database = {
    ...config.database,
    dataBaseName: config.env
}

module.exports = config