const http = require('http')
require('dotenv').config()
const app = require('../app')
const config = require('../config')
const logger = require('../helpers/logger')
const banner = require('../helpers/banner')
require('../db')

let port = config.port
logger.info(banner)
logger.info(`Server Port : ${port}`, port)
logger.info(`Environment type: ${config.env}`)
// Create a web server
const server = http.createServer(app)
logger.info('Server is created')
const onListening = () => {
    const address = server.address()
    const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${address.port}`;
    logger.info('Server is listening on ' + bind)
}


logger.info('Register listening event handler')
server.on('listening', onListening)

const start = (port) => {
    try {
        logger.info('Start server...')
        server.listen(port);
    } catch (e) {
        logger.error(`Failed to start server due to : ${e.message}`)
        process.exit()
    }
}

start(port)

