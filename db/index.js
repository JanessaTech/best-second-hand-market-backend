const mongoose = require('mongoose')
const logger = require('../helpers/logger')

mongoose.connect('mongodb://127.0.0.1/stu')
let db = mongoose.connection
db.once('open', () => {
    logger.info('Connected to the database.');
});
db.on('error', (err) => {
    logger.error(`Database error: ${err}`);
    process.exit()
});

module.exports = mongoose