const BaseError = require('../base_errors/baseError')
class SiweError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    SiweError
}