const config = require('./config.global')
config.env = 'stage'
config.database = {
    ...config.database,
    dataBaseName: config.env
}

module.exports = config