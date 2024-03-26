const commonConfig = require('./config.common')
const config = {...commonConfig};

// basic config
config.env = 'dev'
config.port = 3100
config.apiPrefix = '/apis/v1'
config.gateway='http://localhost:8080'    //https://nftstorage.link
config.database = {
    host: '127.0.0.1'
}
config.staticDirs = {
    profiles: 'uploads'
}
config.redis = {
    username: '', 
    password: 'redis',
    host: '192.168.0.102',
    port: 6379
}


module.exports = config