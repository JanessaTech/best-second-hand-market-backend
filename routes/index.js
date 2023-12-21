const accountRouter = require('./account')
const userRouter = require('./user')
const todoRouter = require('./todo')
const siweRouter = require('./siwe')
const apiPrefix = require('../config').apiPrefix
const routes = app => {
    app.use(apiPrefix + '/accounts', accountRouter)
    app.use(apiPrefix + '/users', userRouter)
    app.use(apiPrefix + '/todos', todoRouter)
    app.use(apiPrefix + '/siwe', siweRouter)
}

module.exports = routes