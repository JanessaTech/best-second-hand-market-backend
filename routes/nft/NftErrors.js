const BaseError = require('../base_errors/baseError')

class NftError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    NftError
}