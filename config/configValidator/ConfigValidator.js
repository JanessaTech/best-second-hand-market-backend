const config = require('../configuration')
const logger = require('../../helpers/logger')

class ConfigValidator {
    constructor() {
        this.doCheck()
    }

    doCheck() {
        logger.info('Start validation for configuration')
        // TBD - We do validation for config file
        logger.info('Validation for configuration is done!')
    }
}

const configValidator = new ConfigValidator()
module.exports = configValidator