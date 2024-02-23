const config = {};

// basic config
config.env = 'dev'
config.port = 3100
config.apiPrefix = '/apis/v1'
config.database = {
    host: '127.0.0.1'
}
config.CATEGORIES = ['pets', 'clothes', 'cosmetics', 'outfits', 'car', 'devices', 'books']
config.NFTSTATUS = ['on', 'off']

module.exports = config