const BaseError = require('../../routes/base_errors/baseError')

class ConfigChainError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    ConfigChainError
}