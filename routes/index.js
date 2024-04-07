const accountRouter = require('./account')
const userRouter = require('./user')
const nftRouter = require('./nft')
const cartRouter = require('./cart')
const likeRouter = require('./like')
const orderRouter = require('./order')
const commentRouter = require('./comment')
const siweRouter = require('./siwe')
const ipfsRouter = require('./ipfs')
const balanceRouter = require('./balance')
const apiPrefix = require('../config/configuration').apiPrefix

const routes = app => {
    app.use(apiPrefix + '/accounts', accountRouter)
    app.use(apiPrefix + '/users', userRouter)
    app.use(apiPrefix + '/nfts', nftRouter)
    app.use(apiPrefix + '/cart', cartRouter)
    app.use(apiPrefix + '/orders', orderRouter)
    app.use(apiPrefix + '/likes', likeRouter)
    app.use(apiPrefix + '/comments', commentRouter)
    app.use(apiPrefix + '/siwe', siweRouter)
    app.use(apiPrefix + '/ipfs', ipfsRouter)
    app.use(apiPrefix + '/balances', balanceRouter)
}

module.exports = routes