const BaseError = require('../../helpers/errors/baseError')

class NftError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    NftError
}