const BaseError = require('../../helpers/errors/baseError')
class SiweError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    SiweError
}