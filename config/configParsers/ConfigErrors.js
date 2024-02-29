const BaseError = require('../../helpers/errors/baseError')

class ConfigChainError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    ConfigChainError
}