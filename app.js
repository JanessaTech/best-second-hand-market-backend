const express = require('express')
const cors = require('cors');
const app = express()
const cookieParser = require('cookie-parser')
const config = require('./config/configuration')

//define where to upload profile file to. we could access these filer under the dir by http://localhost:3100/file.png (file.png is the file under the dir)
app.use(express.static(`${config.staticDirs.profiles}/${config.env}`))

const initRoutes = require('./routes')
const initGlobalErrorHandlers = require('./helpers/errors/globleErrorHandlers')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

initRoutes(app)
initGlobalErrorHandlers(app)

module.exports = app

