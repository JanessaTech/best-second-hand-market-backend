const BaseError = require('../base_errors/baseError')

class CartError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    CartError
}