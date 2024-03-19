const BaseError = require('../base_errors/baseError')

class AccountError extends BaseError {
    constructor(props) {
        super(props);
    }
}

/**
 * Here is an example of how to add a new local custom error under account
 */
class AccountDemoError extends BaseError {
    constructor(props) {
        super(props);
    }
}
module.exports = {
    AccountError ,
    AccountDemoError
}