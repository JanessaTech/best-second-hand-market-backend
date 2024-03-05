const BaseError = require('../../helpers/errors/baseError')

class OrderError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    OrderError
}