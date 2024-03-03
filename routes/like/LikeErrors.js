const BaseError = require('../../helpers/errors/baseError')

class LikeError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    LikeError
}