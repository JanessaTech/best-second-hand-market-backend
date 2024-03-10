const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const config = require('../config/configuration')

mongoose.connect(`mongodb://${config.database.host}:27017/${config.database.dataBaseName}`)
let db = mongoose.connection
db.once('open', () => {
    logger.info(`mongodb connection url: mongodb://${config.database.host}:27017/${config.database.dataBaseName}`)
    logger.info('Connected to the database.');
});
db.on('error', (err) => {
    logger.debug(`mongodb connection url: mongodb://${config.database.host}:27017/${config.database.dataBaseName}`)
    logger.error(`Database error: ${err}`);
    process.exit()
});