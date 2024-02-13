const config = require('./config.global')
config.env = 'dev'
config.database = {
    ...config.database,
    dataBaseName: config.env
}

module.exports = config