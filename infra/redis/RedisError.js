const BaseError = require('../../routes/base_errors/baseError')

class RedisError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    RedisError
}