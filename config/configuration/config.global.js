const commonConfig = require('./config.common')
const config = {...commonConfig};

// basic config
config.env = 'dev'
config.port = 3100
config.apiPrefix = '/apis/v1'
config.gateway='http://localhost:8080'    //https://nftstorage.link
config.nft_storage = {
    API_KEY:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDcxZWM5OEE1NWUwQjY3NzJDQTJCZTc4OTFhRkQ3MTc0NTJBMEJjMzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMTI0Njc1MjQ5MiwibmFtZSI6ImhhbmQtc2VuZC1kZW1vIn0.q-s2hyM5fBZrKEyuYFEcl8SCdNOox42oAulI3PraRSU'
}
config.database = {
    host: '127.0.0.1'
}
config.staticDirs = {
    profiles: 'uploads',
    ipfs: 'ipfs'
}
config.redis = {
    username: '', 
    password: 'redis',
    host: '192.168.0.102',
    port: 6379
}


module.exports = config