const BaseError = require('../base_errors/baseError')

class LikeError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    LikeError
}