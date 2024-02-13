const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const config = require('../config')
const initTeacherSchema = require('./student')
const initUserSchema = require('./user')

logger.info(`mongodb connection url: mongodb://${config.database.host}/${config.database.dataBaseName}`)
mongoose.connect(`mongodb://${config.database.host}/${config.database.dataBaseName}`)
let db = mongoose.connection
db.once('open', () => {
    logger.info('Connected to the database.');
});
db.on('error', (err) => {
    logger.error(`Database error: ${err}`);
    process.exit()
});

const Student = initTeacherSchema(mongoose)
const User = initUserSchema(mongoose)

module.exports = {Student, User}