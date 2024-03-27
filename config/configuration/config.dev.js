const config = require('./config.global')
config.env = 'local'
config.database = {
    ...config.database,
    dataBaseName: config.env
}
config.redis = {
    ...config.redis,
}
config.nft_storage = {
    ...config.nft_storage,
    API_KEY:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDcxZWM5OEE1NWUwQjY3NzJDQTJCZTc4OTFhRkQ3MTc0NTJBMEJjMzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMTI0Njc1MjQ5MiwibmFtZSI6ImhhbmQtc2VuZC1kZW1vIn0.q-s2hyM5fBZrKEyuYFEcl8SCdNOox42oAulI3PraRSU'
}

module.exports = config