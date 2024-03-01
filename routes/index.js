const accountRouter = require('./account')
const userRouter = require('./user')
const nftRouter = require('./nft')
const cartRouter = require('./cart')
const todoRouter = require('./todo')
const siweRouter = require('./siwe')
const apiPrefix = require('../config/configuration').apiPrefix
const routes = app => {
    app.use(apiPrefix + '/accounts', accountRouter)
    app.use(apiPrefix + '/users', userRouter)
    app.use(apiPrefix + '/nfts', nftRouter)
    app.use(apiPrefix + '/cart', cartRouter)
    app.use(apiPrefix + '/todos', todoRouter)
    app.use(apiPrefix + '/siwe', siweRouter)
}

module.exports = routes