const BaseError = require('../base_errors/baseError')

class OrderError extends BaseError {
    constructor(props) {
        super(props);
    }
}

class FullOrderViewError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    OrderError, FullOrderViewError
}