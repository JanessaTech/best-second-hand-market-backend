const BaseError = require('../../helpers/errors/baseError')

class CartError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    CartError
}