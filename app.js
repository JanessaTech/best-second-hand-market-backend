const express = require('express')
const cors = require('cors');
const app = express()
const cookieParser = require('cookie-parser')

app.use(express.static('uploads')) // we could access to the file by saying http://localhost:3100/file.png

const initRoutes = require('./routes')
const initGlobalErrorHandlers = require('./helpers/errors/globleErrorHandlers')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

initRoutes(app)
initGlobalErrorHandlers(app)

module.exports = app

