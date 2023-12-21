const express = require('express')
const cors = require('cors');
const app = express()
const cookieParser = require('cookie-parser')
const initRoutes = require('./routes')
const initGlobalErrorHandlers = require('./helpers/errors/globleErrorHandlers')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

initRoutes(app)
initGlobalErrorHandlers(app)

module.exports = app

