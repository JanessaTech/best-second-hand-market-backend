const config = require('./config.global')
config.env = 'local'
config.database = {
    ...config.database,
    dataBaseName: config.env
}
config.redis = {
    ...config.redis,
}

module.exports = config